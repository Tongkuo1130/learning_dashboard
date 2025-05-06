const db = require('./db');
const moment = require('moment'); // 用于日期处理

class AnalysisModel {
  constructor() {
    // 可以初始化常用参数
    this.recentDays = 7; // 最近一周
    this.errorSampleSize = 50; // 错误分析样本量
  }

  // 1. 学习概览分析
  async getLearningOverview(studentId) {
    const startDate = moment().subtract(this.recentDays, 'days').unix();
    
    const [challenges, scores, debugs, discussions] = await Promise.all([
      // 最近一周完成的挑战数
      db.query(`
        SELECT COUNT(*) AS completed_challenges
        FROM challenge_interaction
        WHERE user_id = ? AND status = 2 AND end_time >= ?
      `, [studentId, startDate]),
      
      // 最近一周的平均得分
      db.query(`
        SELECT AVG(final_score) AS avg_score
        FROM challenge_interaction
        WHERE user_id = ? AND end_time >= ? AND status = 2
      `, [studentId, startDate]),
      
      // 调试次数
      db.query(`
        SELECT COUNT(*) AS debug_count
        FROM outputs
        WHERE user_id = ? AND query_index > 1 AND timestamp >= ?
      `, [studentId, startDate]),
      
      // 讨论参与次数
      db.query(`
        SELECT COUNT(*) AS discussion_count
        FROM discussions
        WHERE user_id = ? AND created_at >= ?
      `, [studentId, startDate])
    ]);
    
    return {
      completedChallenges: challenges[0].completed_challenges || 0,
      averageScore: scores[0].avg_score ? Math.round(scores[0].avg_score * 100) / 100 : 0,
      debugAttempts: debugs[0].debug_count || 0,
      discussionParticipations: discussions[0].discussion_count || 0
    };
  }

  // 2. 课程进度分析
  async getCourseProgress(studentId, courseId) {
    const [total, completed] = await Promise.all([
      // 课程总挑战数
      db.query(`
        SELECT COUNT(*) AS total
        FROM challenge
        WHERE course_id = ?
      `, [courseId]),
      
      // 学生已完成挑战数
      db.query(`
        SELECT COUNT(DISTINCT challenge_id) AS completed
        FROM challenge_interaction
        WHERE user_id = ? AND status = 2 AND challenge_id IN (
          SELECT id FROM challenge WHERE course_id = ?
        )
      `, [studentId, courseId])
    ]);
    
    const progress = total[0].total > 0 
      ? Math.round((completed[0].completed / total[0].total) * 100)
      : 0;
    
    return {
      totalChallenges: total[0].total,
      completedChallenges: completed[0].completed,
      progressPercentage: progress
    };
  }

  // 3. 得分趋势分析
  async getScoreTrend(studentId, period = 'week') {
    let interval, format;
    
    switch (period) {
      case 'week':
        interval = 7;
        format = '%Y-%m-%d';
        break;
      case 'month':
        interval = 30;
        format = '%Y-%m-%d';
        break;
      case 'year':
        interval = 365;
        format = '%Y-%m';
        break;
      default:
        interval = 7;
        format = '%Y-%m-%d';
    }
    
    return db.query(`
      SELECT 
        strftime(?, datetime(end_time, 'unixepoch')) AS period,
        AVG(final_score) AS avg_score,
        COUNT(*) AS attempt_count
      FROM challenge_interaction
      WHERE user_id = ? AND status = 2 AND end_time >= ?
      GROUP BY period
      ORDER BY period
    `, [
      format, 
      studentId,
      moment().subtract(interval, 'days').unix()
    ]);
  }

  // 4. 学习活跃度分析
  async getLearningActivity(studentId) {
    const startDate = moment().subtract(this.recentDays, 'days').unix();
    
    return db.query(`
      SELECT 
        strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch')) AS date,
        COUNT(DISTINCT CASE WHEN query_index = 1 THEN interaction_id END) AS new_attempts,
        COUNT(CASE WHEN query_index > 1 THEN 1 END) AS debug_attempts,
        SUM(duration_minutes) AS total_debug_time
      FROM outputs
      WHERE user_id = ? AND timestamp >= ?
      GROUP BY date
      ORDER BY date
    `, [studentId, startDate]);
  }

  // 5. 最近提交的挑战及完成情况
  async getRecentChallenges(studentId, limit = 5) {
    return db.query(`
      SELECT 
        c.name AS challenge_name,
        ci.final_score,
        ci.status,
        ci.end_time,
        ci.evaluate_count AS attempts,
        (SELECT COUNT(*) FROM outputs WHERE interaction_id = ci.id) AS debug_count
      FROM challenge_interaction ci
      JOIN challenge c ON ci.challenge_id = c.id
      WHERE ci.user_id = ?
      ORDER BY ci.end_time DESC
      LIMIT ?
    `, [studentId, limit]);
  }

  // 6. 代码能力分析
  async getCodeProficiency(studentId) {
    return db.query(`
      SELECT 
        AVG(final_score) AS avg_score,
        COUNT(DISTINCT challenge_id) AS unique_challenges,
        SUM(evaluate_count) AS total_attempts,
        (SELECT COUNT(*) FROM outputs WHERE user_id = ? AND result = 1) AS passed_tests,
        (SELECT COUNT(*) FROM outputs WHERE user_id = ?) AS total_tests,
        (SELECT COUNT(*) FROM discussions WHERE user_id = ? AND parent_discuss_id IS NOT NULL) AS help_requests
      FROM challenge_interaction
      WHERE user_id = ?
    `, [studentId, studentId, studentId, studentId]);
  }

  // 7. 错误类型分析
  async getErrorAnalysis(studentId) {
    return db.query(`
      SELECT 
        test_set_position,
        actual_output,
        COUNT(*) AS error_count,
        COUNT(DISTINCT challenge_id) AS affected_challenges
      FROM outputs
      WHERE user_id = ? AND result = 0
      GROUP BY test_set_position, actual_output
      ORDER BY error_count DESC
      LIMIT ?
    `, [studentId, this.errorSampleSize]);
  }

  // 8. 调试行为分析
  async getDebugBehavior(studentId) {
    return db.query(`
      SELECT 
        c.name AS challenge_name,
        ci.evaluate_count AS total_attempts,
        (SELECT COUNT(*) FROM outputs WHERE interaction_id = ci.id) AS debug_steps,
        (SELECT MAX(timestamp) - MIN(timestamp) FROM outputs WHERE interaction_id = ci.id) AS debug_duration_seconds
      FROM challenge_interaction ci
      JOIN challenge c ON ci.challenge_id = c.id
      WHERE ci.user_id = ? AND ci.evaluate_count > 1
      ORDER BY ci.end_time DESC
      LIMIT 10
    `, [studentId]);
  }

  // 9. 学习时间分布
  async getLearningTimeDistribution(studentId) {
    return db.query(`
      SELECT 
        strftime('%Y-%m-%d', datetime(open_time, 'unixepoch')) AS date,
        strftime('%H', datetime(open_time, 'unixepoch')) AS hour,
        COUNT(*) AS activity_count,
        SUM((end_time - open_time)/60) AS learning_minutes
      FROM challenge_interaction
      WHERE user_id = ? AND open_time >= ?
      GROUP BY date, hour
      ORDER BY date, hour
    `, [
      studentId,
      moment().subtract(4, 'weeks').unix()
    ]);
  }

  // 综合仪表盘数据获取
  async getDashboardData(studentId, courseId) {
    return Promise.all([
      this.getLearningOverview(studentId),
      this.getCourseProgress(studentId, courseId),
      this.getScoreTrend(studentId, 'week'),
      this.getLearningActivity(studentId),
      this.getRecentChallenges(studentId),
      this.getCodeProficiency(studentId),
      this.getErrorAnalysis(studentId),
      this.getDebugBehavior(studentId),
      this.getLearningTimeDistribution(studentId)
    ]).then(([
      overview, progress, scoreTrend, activity, 
      recentChallenges, proficiency, errors, 
      debugBehavior, timeDistribution
    ]) => ({
      overview,
      progress,
      scoreTrend,
      activity,
      recentChallenges,
      proficiency,
      errors,
      debugBehavior,
      timeDistribution
    }));
  }
}

module.exports = new AnalysisModel();
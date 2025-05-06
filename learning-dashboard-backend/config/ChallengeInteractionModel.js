const BaseModel = require('./BaseModel');

class ChallengeInteractionModel extends BaseModel {
  constructor() {
    super('challenge_interaction');
  }

  // 获取关卡通过率分析
  async getChallengePassRate(challengeId) {
    const sql = `
      SELECT 
        COUNT(*) AS total_attempts,
        SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS passed_attempts,
        AVG(final_score) AS average_score,
        AVG(star) AS average_rating
      FROM challenge_interaction
      WHERE challenge_id = ?
    `;
    return this.query(sql, [challengeId]);
  }

  // 获取用户尝试模式分析
  async getUserRetryPatterns(userId) {
    const sql = `
      SELECT 
        challenge_id,
        COUNT(*) AS total_attempts,
        MAX(final_score) AS best_score,
        AVG(evaluate_count) AS avg_retries
      FROM challenge_interaction
      WHERE user_id = ?
      GROUP BY challenge_id
    `;
    return this.query(sql, [userId]);
  }
}

module.exports = new ChallengeInteractionModel();

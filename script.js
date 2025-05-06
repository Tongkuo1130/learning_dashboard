// 全局变量
let chartInstances = {};
let isAIChatOpen = false;
let currentChartFocus = null;

// 初始化仪表盘
function initDashboard() {
    initCharts();
    setupEventListeners();
    updateTime();
    setInterval(updateTime, 1000);
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = 
            `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ` +
            `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }
}

// 初始化所有图表
function initCharts() {
    if (Object.keys(chartInstances).length > 0) return;

    // 基础概览图表
    initProgressChart();
    initScoreTrendChart();
    initActivityChart();
    
    // 深度分析图表
    initCodeAbilityChart();
    initErrorAnalysisChart();
    initDebugBehaviorChart();
    initHeatmapChart();
    initProblemPatternChart();
    initKnowledgeGraphChart();

    // 窗口大小变化时重新调整图表大小
    window.addEventListener('resize', function() {
        Object.values(chartInstances).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    });
}

// 初始化课程进度图
function initProgressChart() {
    const chartEl = document.getElementById('progressChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        series: [{
            type: 'gauge',
            startAngle: 90, 
            endAngle: -270, 
            pointer: { show: false },
            progress: { 
                show: true, 
                overlap: false, 
                roundCap: true, 
                clip: false, 
                itemStyle: { 
                    color: { 
                        type: 'linear', 
                        x: 0, 
                        y: 0, 
                        x2: 0, 
                        y2: 1, 
                        colorStops: [
                            { offset: 0, color: '#1890ff' }, 
                            { offset: 1, color: '#13c2c2' }
                        ] 
                    } 
                } 
            },
            axisLine: { lineStyle: { width: 12 } }, 
            splitLine: { show: false }, 
            axisTick: { show: false }, 
            axisLabel: { show: false },
            detail: { 
                valueAnimation: true, 
                fontSize: 28, 
                offsetCenter: [0, '0%'], 
                formatter: '{value}%', 
                color: '#1890ff' 
            },
            data: [{ value: 68 }]
        }]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的课程进度情况，给出学习建议');
    };
    
    chartInstances['progressChart'] = chart;
}

// 初始化得分趋势图
function initScoreTrendChart() {
    const chartEl = document.getElementById('scoreTrendChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { top: '15%', bottom: '15%', left: '10%', right: '5%' },
        xAxis: { 
            type: 'category', 
            data: ['6/1', '6/5', '6/10', '6/15', '6/20', '6/25', '6/30'], 
            axisLine: { lineStyle: { color: '#d9d9d9' } }, 
            axisLabel: { color: '#666', fontSize: 10 } 
        },
        yAxis: { 
            type: 'value', 
            min: 60, 
            max: 100, 
            axisLine: { show: false }, 
            axisLabel: { color: '#666', fontSize: 10 }, 
            splitLine: { lineStyle: { color: '#f0f0f0' } } 
        },
        series: [{
            data: [72, 78, 85, 82, 88, 86, 90], 
            type: 'line', 
            smooth: true, 
            symbol: 'circle', 
            symbolSize: 6, 
            lineStyle: { width: 2, color: '#1890ff' }, 
            itemStyle: { color: '#1890ff', borderColor: '#fff', borderWidth: 1 }, 
            areaStyle: { 
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(24, 144, 255, 0.3)' }, 
                    { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
                ]) 
            } 
        }]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的得分趋势，指出进步和需要改进的地方');
    };
    
    chartInstances['scoreTrendChart'] = chart;
}

// 初始化学习活跃度图
function initActivityChart() {
    const chartEl = document.getElementById('activityChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { 
            data: ['提交次数', '调试次数'], 
            top: 5, 
            itemGap: 5, 
            textStyle: { fontSize: 10 } 
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { 
            type: 'category', 
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], 
            axisLine: { lineStyle: { color: '#d9d9d9' } }, 
            axisLabel: { color: '#666', fontSize: 10 } 
        },
        yAxis: { 
            type: 'value', 
            axisLine: { show: false }, 
            axisLabel: { color: '#666', fontSize: 10 }, 
            splitLine: { lineStyle: { color: '#f0f0f0' } } 
        },
        series: [ 
            { 
                name: '提交次数', 
                type: 'bar', 
                barWidth: '30%', 
                data: [12, 15, 18, 14, 20, 8, 5], 
                itemStyle: { color: '#13c2c2' } 
            }, 
            { 
                name: '调试次数', 
                type: 'bar', 
                barWidth: '30%', 
                data: [8, 10, 12, 9, 15, 6, 3], 
                itemStyle: { color: '#1890ff' } 
            } 
        ]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的学习活跃度，指出高效和低效的学习时间段');
    };
    
    chartInstances['activityChart'] = chart;
}

// 初始化代码能力分析图
function initCodeAbilityChart() {
    const chartEl = document.getElementById('codeAbilityChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        tooltip: { trigger: 'item' },
        legend: { 
            data: ['当前能力', '班级平均'], 
            bottom: 10,
            textStyle: { fontSize: 12 }
        },
        radar: {
            indicator: [
                { name: '语法', max: 100 },
                { name: '逻辑', max: 100 },
                { name: '调试', max: 100 },
                { name: '算法', max: 100 },
                { name: '规范', max: 100 },
                { name: '协作', max: 100 }
            ],
            radius: '65%',
            splitNumber: 4,
            axisName: { color: '#666' },
            splitLine: { lineStyle: { color: ['rgba(0, 0, 0, 0.1)'] } },
            splitArea: { show: false },
            axisLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.1)' } }
        },
        series: [{
            type: 'radar',
            data: [
                { 
                    value: [85, 78, 92, 75, 88, 70], 
                    name: '当前能力',
                    itemStyle: { color: '#1890ff' },
                    areaStyle: { color: 'rgba(24, 144, 255, 0.3)' }
                },
                { 
                    value: [90, 85, 85, 80, 90, 80], 
                    name: '班级平均',
                    itemStyle: { color: '#faad14' },
                    lineStyle: { type: 'dashed' }
                }
            ]
        }]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的代码能力雷达图，指出我的优势和不足');
    };
    
    chartInstances['codeAbilityChart'] = chart;
}

// 初始化错误分析图
function initErrorAnalysisChart() {
    const chartEl = document.getElementById('errorAnalysisChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        tooltip: { trigger: 'item' },
        legend: { 
            orient: 'vertical', 
            left: 'left', 
            top: 'center', 
            itemGap: 5, 
            textStyle: { fontSize: 10 } 
        },
        series: [ { 
            name: '错误类型', 
            type: 'pie', 
            radius: ['40%', '70%'], 
            center: ['65%', '50%'], 
            avoidLabelOverlap: false, 
            itemStyle: { 
                borderRadius: 5, 
                borderColor: '#fff', 
                borderWidth: 1 
            }, 
            label: { show: false, position: 'center' }, 
            emphasis: { 
                label: { 
                    show: true, 
                    fontSize: '16', 
                    fontWeight: 'bold' 
                } 
            }, 
            labelLine: { show: false }, 
            data: [ 
                { value: 35, name: '语法错误' }, 
                { value: 28, name: '逻辑错误' }, 
                { value: 20, name: '运行时错误' }, 
                { value: 12, name: '边界条件错误' }, 
                { value: 5, name: '性能问题' } 
            ], 
            color: ['#1890ff', '#13c2c2', '#faad14', '#f5222d', '#722ed1'] 
        } ]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的错误分布情况，指出主要问题类型和改进建议');
    };
    
    chartInstances['errorAnalysisChart'] = chart;
}

// 初始化调试行为分析图
function initDebugBehaviorChart() {
    const chartEl = document.getElementById('debugBehaviorChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        tooltip: { 
            trigger: 'axis', 
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } } 
        },
        legend: { 
            data: ['调试次数', '调试时间'], 
            top: 5, 
            itemGap: 5, 
            textStyle: { fontSize: 10 } 
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { 
            type: 'category', 
            data: ['挑战1', '挑战2', '挑战3', '挑战4', '挑战5', '挑战6', '挑战7'], 
            axisPointer: { type: 'shadow' }, 
            axisLine: { lineStyle: { color: '#d9d9d9' } }, 
            axisLabel: { color: '#666', fontSize: 10 } 
        },
        yAxis: [ 
            { 
                type: 'value', 
                name: '次数', 
                nameTextStyle: { fontSize: 10 }, 
                min: 0, 
                max: 20, 
                axisLine: { lineStyle: { color: '#d9d9d9' } }, 
                axisLabel: { formatter: '{value}', color: '#666', fontSize: 10 }, 
                splitLine: { lineStyle: { color: '#f0f0f0' } } 
            }, 
            { 
                type: 'value', 
                name: '时间(分)', 
                nameTextStyle: { fontSize: 10 }, 
                min: 0, 
                max: 60, 
                axisLine: { lineStyle: { color: '#d9d9d9' } }, 
                axisLabel: { formatter: '{value}', color: '#666', fontSize: 10 }, 
                splitLine: { show: false } 
            } 
        ],
        series: [ 
            { 
                name: '调试次数', 
                type: 'bar', 
                barWidth: '25%', 
                data: [5, 8, 12, 6, 15, 9, 7], 
                itemStyle: { color: '#1890ff' } 
            }, 
            { 
                name: '调试时间', 
                type: 'line', 
                yAxisIndex: 1, 
                data: [12, 18, 25, 15, 35, 22, 17], 
                symbol: 'circle', 
                symbolSize: 6, 
                lineStyle: { width: 2, color: '#faad14' }, 
                itemStyle: { color: '#faad14', borderColor: '#fff', borderWidth: 1 } 
            } 
        ]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的调试行为，指出效率高低和可能的改进方法');
    };
    
    chartInstances['debugBehaviorChart'] = chart;
}

// 初始化热力图
function initHeatmapChart() {
    const chartEl = document.getElementById('heatmapChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        tooltip: { position: 'top' },
        grid: { top: '10%', left: '10%', right: '5%', bottom: '15%' },
        xAxis: { 
            type: 'category', 
            data: ['第1周', '第2周', '第3周', '第4周'], 
            splitArea: { show: true }, 
            axisLine: { lineStyle: { color: '#d9d9d9' } }, 
            axisLabel: { color: '#666', fontSize: 10 } 
        },
        yAxis: { 
            type: 'category', 
            data: ['周六', '周五', '周四', '周三', '周二', '周一', '周日'], 
            splitArea: { show: true }, 
            axisLine: { lineStyle: { color: '#d9d9d9' } }, 
            axisLabel: { color: '#666', fontSize: 10 } 
        },
        visualMap: { 
            min: 0, 
            max: 10, 
            calculable: true, 
            orient: 'horizontal', 
            left: 'center', 
            bottom: '2%', 
            inRange: { 
                color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'] 
            }, 
            textStyle: { fontSize: 10 } 
        },
        series: [{
            name: '学习时长(小时)', 
            type: 'heatmap', 
            data: [
                [0, 0, 2], [0, 1, 1], [0, 2, 3], [0, 3, 4], [0, 4, 6], [0, 5, 3], [0, 6, 2],
                [1, 0, 1], [1, 1, 0], [1, 2, 2], [1, 3, 5], [1, 4, 4], [1, 5, 2], [1, 6, 1],
                [2, 0, 3], [2, 1, 2], [2, 2, 4], [2, 3, 6], [2, 4, 5], [2, 5, 4], [2, 6, 3],
                [3, 0, 2], [3, 1, 1], [3, 2, 3], [3, 3, 7], [3, 4, 8], [3, 5, 5], [3, 6, 4]
            ], 
            label: { show: false }, 
            emphasis: { 
                itemStyle: { 
                    shadowBlur: 10, 
                    shadowColor: 'rgba(0, 0, 0, 0.5)' 
                } 
            } 
        }]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的学习时间分布，指出高效和低效的时间段');
    };
    
    chartInstances['heatmapChart'] = chart;
}

// 初始化问题模式识别图
function initProblemPatternChart() {
    const chartEl = document.getElementById('problemPatternChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        tooltip: {},
        legend: {
            data: ['语法错误', '逻辑错误', '运行时错误'],
            bottom: 10
        },
        series: [{
            name: '问题模式',
            type: 'graph',
            layout: 'force',
            data: [
                { name: '变量未定义', category: 0, symbolSize: 30 },
                { name: '缩进错误', category: 0, symbolSize: 25 },
                { name: '循环条件错误', category: 1, symbolSize: 40 },
                { name: '递归终止条件', category: 1, symbolSize: 35 },
                { name: '空指针异常', category: 2, symbolSize: 20 }
            ],
            links: [
                { source: '变量未定义', target: '缩进错误' },
                { source: '循环条件错误', target: '递归终止条件' },
                { source: '空指针异常', target: '循环条件错误' }
            ],
            categories: [
                { name: '语法错误' },
                { name: '逻辑错误' },
                { name: '运行时错误' }
            ],
            roam: true,
            label: {
                show: true,
                position: 'right'
            },
            force: {
                repulsion: 100
            },
            emphasis: {
                focus: 'adjacency',
                label: {
                    show: true
                }
            }
        }]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的问题模式，指出常见错误类型和关联性');
    };
    
    chartInstances['problemPatternChart'] = chart;
}

// 初始化知识图谱图
function initKnowledgeGraphChart() {
    const chartEl = document.getElementById('knowledgeGraphChart');
    if (!chartEl) return;

    const chart = echarts.init(chartEl);
    chart.setOption({
        tooltip: {},
        series: [{
            type: 'graph',
            layout: 'circular',
            data: [
                { name: '变量', value: 80 },
                { name: '循环', value: 70 },
                { name: '条件判断', value: 75 },
                { name: '函数', value: 85 },
                { name: '递归', value: 60 },
                { name: '面向对象', value: 65 }
            ],
            links: [
                { source: '变量', target: '循环' },
                { source: '变量', target: '条件判断' },
                { source: '循环', target: '函数' },
                { source: '条件判断', target: '递归' },
                { source: '函数', target: '面向对象' }
            ],
            categories: [
                { name: '基础概念' },
                { name: '控制结构' },
                { name: '高级特性' }
            ],
            roam: true,
            label: {
                show: true,
                position: 'right'
            },
            lineStyle: {
                color: 'source',
                curveness: 0.3
            },
            emphasis: {
                focus: 'adjacency',
                label: {
                    show: true
                }
            }
        }]
    });
    
    chartEl.onclick = () => {
        currentChartFocus = chartEl;
        openAIChatWithQuestion('请分析我的知识掌握图谱，指出薄弱环节和学习建议');
    };
    
    chartInstances['knowledgeGraphChart'] = chart;
}

// 内容区域切换函数
function showSection(sectionId) {
    // 切换按钮激活状态
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`.nav-tab[onclick="showSection('${sectionId}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // 切换内容显示
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active-section');
        section.style.display = 'none';
    });
    const activeSection = document.getElementById(sectionId + '-section');
    if (activeSection) {
        activeSection.classList.add('active-section');
        activeSection.style.display = 'grid';

        // 重新调整图表大小
        setTimeout(() => {
            activeSection.querySelectorAll('.chart-container').forEach(container => {
                const chartId = container.id;
                const chartInstance = chartInstances[chartId];
                if (chartInstance && typeof chartInstance.resize === 'function') {
                    chartInstance.resize();
                }
            });
        }, 50);
    }
}

// AI助手交互功能
function openAIChat() {
    isAIChatOpen = true;
    document.getElementById('aiAssistant').classList.add('active');
    document.getElementById('ai-guide').classList.add('hidden');
    document.getElementById('aiQuestion').focus();
    
    // 如果有聚焦的图表，添加相关解释
    if (currentChartFocus) {
        explainCurrentChart();
    }
}

function openAIChatWithQuestion(question) {
    openAIChat();
    setTimeout(() => {
        askAI(question);
    }, 300);
}

function closeAIChat() {
    isAIChatOpen = false;
    document.getElementById('aiAssistant').classList.remove('active');
    document.getElementById('ai-guide').classList.remove('hidden');
    currentChartFocus = null;
}

// 解释当前聚焦的图表
function explainCurrentChart() {
    if (!currentChartFocus) return;
    
    const chartId = currentChartFocus.id;
    let question = '';
    
    switch(chartId) {
        case 'progressChart':
            question = '请分析我的课程进度情况，给出学习建议';
            break;
        case 'scoreTrendChart':
            question = '请分析我的得分趋势，指出进步和需要改进的地方';
            break;
        case 'activityChart':
            question = '请分析我的学习活跃度，指出高效和低效的学习时间段';
            break;
        case 'codeAbilityChart':
            question = '请分析我的代码能力雷达图，指出我的优势和不足';
            break;
        case 'errorAnalysisChart':
            question = '请分析我的错误分布情况，指出主要问题类型和改进建议';
            break;
        case 'debugBehaviorChart':
            question = '请分析我的调试行为，指出效率高低和可能的改进方法';
            break;
        case 'heatmapChart':
            question = '请分析我的学习时间分布，指出高效和低效的时间段';
            break;
        case 'problemPatternChart':
            question = '请分析我的问题模式，指出常见错误类型和关联性';
            break;
        case 'knowledgeGraphChart':
            question = '请分析我的知识掌握图谱，指出薄弱环节和学习建议';
            break;
        default:
            question = `请分析${chartId.replace('Chart', '')}图表`;
    }
    
    askAI(question);
}

// 设置事件监听
function setupEventListeners() {
    // Enter键发送消息
    document.getElementById('aiQuestion').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            askAI();
        }
    });
    
    // 点击空白处关闭AI面板
    document.addEventListener('click', (e) => {
        const aiPanel = document.getElementById('aiAssistant');
        const aiGuide = document.getElementById('ai-guide');
        
        if (isAIChatOpen && 
            !aiPanel.contains(e.target) && 
            !aiGuide.contains(e.target) &&
            !e.target.closest('.chart-container')) {
            closeAIChat();
        }
    });
}

// 模拟AI响应
async function mockAIResponse(question) {
    console.log("Asking AI:", question);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const knowledgeMap = {
        "进度": "您的课程进度为68%，略低于班级平均水平(75%)。建议：1. 每天固定时间学习 2. 优先完成核心章节 3. 遇到困难及时提问",
        "得分": "近30天得分从72提升到90，进步明显！但在递归章节得分波动较大(82→75→88)。建议加强递归基础概念的练习。",
        "活跃": "学习活跃度分析：\n- 高效时段：周二、周四晚上(18-21点)\n- 低效时段：周末白天\n建议保持高效时段的学习强度，周末可适当休息。",
        "能力": "能力分析：\n优势：调试能力(92分)、语法掌握(85分)\n不足：算法设计(75分)、协作能力(70分)\n建议：多参与结对编程，练习经典算法题",
        "错误": "错误分布：\n1. 语法错误(35%)：变量命名不规范、缩进问题\n2. 逻辑错误(28%)：循环条件错误\n建议：使用IDE语法检查，编写伪代码理清逻辑",
        "调试": "调试行为分析：\n- 高效：快速定位语法错误(平均5分钟)\n- 低效：逻辑错误耗时较长(平均25分钟)\n建议：使用调试器逐步执行，添加打印语句",
        "时间": "学习时间热图分析：\n最佳时段：工作日晚上19-21点\n空白时段：周日全天\n建议：保持工作日节奏，周日可安排复习",
        "模式": "常见问题模式：\n1. 递归终止条件错误(关联循环条件)\n2. 变量作用域混淆\n3. 边界条件忽略\n建议：建立错误检查清单",
        "知识": "知识图谱分析：\n掌握良好：变量、函数\n薄弱环节：递归、面向对象\n建议学习路径：递归基础 → 递归优化 → OOP概念",
        "推荐": "根据分析推荐：\n1. 递归视频教程(匹配度95%)\n2. 算法练习题(匹配度90%)\n3. 协作编程挑战(匹配度85%)"
    };

    const lowerQ = question.toLowerCase();
    let response = "我可以帮助您分析学习数据。您可以问我关于课程进度、得分趋势、学习活跃度、错误分析等方面的问题。";
    
    // 关键词匹配
    const keywords = {
        "进度": ["进度", "课程", "完成率"],
        "得分": ["得分", "分数", "趋势"],
        "活跃": ["活跃", "时间", "分布"],
        "能力": ["能力", "雷达", "评估"],
        "错误": ["错误", "问题", "bug"],
        "调试": ["调试", "解决", "修复"],
        "时间": ["时间", "热图", "分布"],
        "模式": ["模式", "聚类", "类型"],
        "知识": ["知识", "图谱", "掌握"],
        "推荐": ["推荐", "建议", "下一步"]
    };
    
    for (const [key, terms] of Object.entries(keywords)) {
        if (terms.some(term => lowerQ.includes(term))) {
            response = knowledgeMap[key];
            break;
        }
    }
    
    // 添加随机问候语使对话更自然
    const greetings = ["分析结果显示", "根据您的学习数据", "我发现", "数据显示", "从图表可以看出"];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return `${randomGreeting}：\n${response}`;
}

async function askAI(predefinedQuestion = null) {
    const input = document.getElementById('aiQuestion');
    const question = predefinedQuestion || input.value.trim();
    if (!question) return;

    // 添加用户消息
    addMessage(question, 'user');
    if (!predefinedQuestion) {
        input.value = '';
    }

    // 显示加载状态
    const loadingMsg = addMessage('思考中...', 'bot');

    try {
        const response = await mockAIResponse(question);
        if (loadingMsg) loadingMsg.remove();
        addMessage(response, 'bot');
    } catch (error) {
        console.error("AI Error:", error);
        if (loadingMsg) loadingMsg.remove();
        addMessage('抱歉，服务暂时出了一点问题，请稍后再试。', 'bot');
    }
}

function addMessage(text, sender) {
    const messages = document.getElementById('aiMessages');
    if (!messages) return null;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${sender}-message`;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
    return msgDiv;
}

// 页面加载初始化
document.addEventListener('DOMContentLoaded', initDashboard);
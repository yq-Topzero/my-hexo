document.addEventListener('DOMContentLoaded', () => {
    //===============================================================//
    // 侧边栏相关元素
    // const sidebar = document.querySelector('.sidebar');
    // const sidebarToggle = document.querySelector('.sidebar-toggle');
    // const closeSidebarBtn = document.querySelector('.close-sidebar');
    // const questionList = document.querySelector('.question-list');
    // const progressFill = document.querySelector('.progress-fill');
    // const progressText = document.querySelector('.progress-text');
    //===============================================================//
    // 题目容器相关
    const questionContainer = document.getElementById('question-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const totalQuestions = document.getElementById('total-questions');
    const currentQuestion = document.getElementById('current-question');

    // 状态管理
    let currentIndex = 0;
    let userAnswers = []; 
    let startTime;
    let currentSetName;
    let currentQuestions;

    // 根据课堂练习表现调整难度比例
    // function getDifficultyRatios() {
    //     // 默认难度比例
    //     const defaultRatios = {
    //         // 选择题难度比例（简单:中等:困难）
    //         choice: { 
    //             easy: 2,    // 简单题数量
    //             medium: 2,  // 中等题数量
    //             hard: 2     // 困难题数量
    //         },
    //         // 填空题难度比例
    //         fill_blank: { 
    //             easy: 2,    // 简单题数量
    //             medium: 1,  // 中等题数量
    //             hard: 1     // 困难题数量
    //         }
    //     };

    //     // 获取课堂练习表现
    //     let performance = { correct: 0, total: 0 };
    //     try {
    //         const storedPerformance = localStorage.getItem('classPerformance');
    //         if (storedPerformance) {
    //             performance = JSON.parse(storedPerformance);
    //         }
    //     } catch (e) {
    //         console.error('无法获取课堂练习表现:', e);
    //         return defaultRatios;
    //     }

    //     // 如果没有完成课堂练习或数据异常，使用默认比例
    //     if (!performance.total || performance.total < 4) {
    //         return defaultRatios;
    //     }

    //     // 计算正确率
    //     const correctRate = performance.correct / performance.total;
    //     console.log(`课堂练习表现: ${performance.correct}/${performance.total}, 正确率: ${correctRate}`);

    //     // 根据正确率调整难度比例
    //     const adjustedRatios = {
    //         choice: { easy: 2, medium: 2, hard: 2 },
    //         fill_blank: { easy: 2, medium: 1, hard: 1 }
    //     };

    //     if (correctRate >= 0.75) {
    //         // 表现优秀，增加困难题目
    //         adjustedRatios.choice = { easy: 1, medium: 2, hard: 3 };
    //         adjustedRatios.fill_blank = { easy: 1, medium: 1, hard: 2 };
    //         console.log('表现优秀，增加困难题目');
    //     } else if (correctRate >= 0.5) {
    //         // 表现良好，增加中等题目
    //         adjustedRatios.choice = { easy: 1, medium: 3, hard: 2 };
    //         adjustedRatios.fill_blank = { easy: 1, medium: 2, hard: 1 };
    //         console.log('表现良好，增加中等题目');
    //     } else {
    //         // 表现一般，增加简单题目
    //         adjustedRatios.choice = { easy: 3, medium: 2, hard: 1 };
    //         adjustedRatios.fill_blank = { easy: 3, medium: 1, hard: 0 };
    //         console.log('表现一般，增加简单题目');
    //     }

    //     return adjustedRatios;
    // }

    // 初始化系统
    async function init() {
        console.log('初始化系统...');
        startTime = new Date();
    
        // 加载题目集
        currentSetName = selectQuestionSet();
        currentQuestions = loadQuestionSet(currentSetName);
        window.selectedQuestions = currentQuestions;
    
        // 初始化界面
        initQuestionElements();
        initSidebar();
        initQuestionEvents();
        totalQuestions.textContent = window.selectedQuestions.length;
        userAnswers = new Array(window.selectedQuestions.length).fill(null);
        showQuestion(0);

    }
    
    function loadQuestionSet(setName) {
        // 从sessionStorage读取题组设置
        console.log(`[题组加载] 加载题组: ${setName}`);
        
        // 根据题组名称获取题目
        try {
            // 检查QuestionBank是否存在
            if (!window.QuestionBank || !window.QuestionBank.getQuestionSet) {
                console.error('题库未正确加载，使用动态生成题目');
                return generateDynamicQuestions();
            }
            
            // 获取预设题组
            return getPredefinedSet(setName);
        } catch (error) {
            console.error('加载题组失败:', error);
            return generateDynamicQuestions();
        }
    }

    // 修改：获取预置题组
    function getPredefinedSet(setName) {
        try {
            // 获取题组
            const set = window.QuestionBank.getQuestionSet(setName);
            
            if (!set || !set.choice || !set.fill_blank) {
                console.error(`题组 ${setName} 格式不正确`);
                return generateDynamicQuestions();
            }
            
            // 合并选择题和填空题
            const questions = [
                ...set.choice,
                ...set.fill_blank
            ].map((q, index) => ({...q, displayIndex: index + 1}));
            
            console.log(`[题组加载] 成功加载题组 ${setName}，共 ${questions.length} 题`);
            return questions;
        } catch (error) {
            console.error(`获取预设题组 ${setName} 失败:`, error);
            return generateDynamicQuestions();
        }
    }

    //动态生成题目函数
    function generateDynamicQuestions() {
        console.log('[题组加载] 使用动态生成题目');
        
        // 创建一些基本题目作为备用
        const fallbackQuestions = [
            {
                id: 1,
                type: "choice",
                difficulty: "easy",
                question: "煎1个鸡蛋，每面2分钟，总时间多久？",
                options: ["A. 2分钟", "B. 4分钟", "C. 6分钟"],
                correct_answer: "B",
                explanation: "单面需2分钟，两面共4分钟。",
                displayIndex: 1
            },
            {
                id: 2,
                type: "choice",
                difficulty: "medium",
                question: "锅一次煎3条鱼，每条鱼需正反各3分钟。煎4条鱼最少需几分钟？",
                options: ["A. 6分钟", "B. 9分钟", "C. 12分钟"],
                correct_answer: "B",
                explanation: "分2批：3条煎正反（6分钟）+1条煎正反（3分钟），共9分钟。",
                displayIndex: 2
            },
            {
                id: 3,
                type: "fill_blank",
                difficulty: "easy",
                question: "锅一次煎2张饼，每面3分钟，煎4张饼最少需______分钟。",
                correct_answer: "12",
                explanation: "分2批煎，每批2张×6分钟=12分钟。",
                displayIndex: 3
            },
            {
                id: 4,
                type: "fill_blank",
                difficulty: "medium",
                question: "快递分拣机一次处理6件包裹，每件需2分钟。分拣14件最少需______分钟。",
                correct_answer: "12",
                explanation: "分3批：6件×2次（4分钟×2=8分钟） +2件×2分钟=12分钟。",
                displayIndex: 4
            }
        ];
        
        return fallbackQuestions;
    }

    // 新增：选择题组逻辑
    function selectQuestionSet() {
        const performance = JSON.parse(localStorage.getItem('classPerformance') || '{}');
    const errors = performance.errors || [];

    // 根据错误类型选择专项题组
    if (errors.includes('q2') && errors.includes('q3')) {
        return 'q2_q3_error';
    } else if (errors.includes('q2')) {
        return 'q2_error'; 
    } else if (errors.includes('q3')) {
        return 'q3_error';
    } else if (errors.includes('q5')) {
        return 'q5_error';
    }
    
    return 'default';
    }

    // 新增：按难度选择题目
    function selectByDifficulty(type, ratios) {
        return Object.entries(ratios).reduce((arr, [difficulty, count]) => {
            const pool = window.QuestionBank[type]?.[difficulty] || [];
            return arr.concat(shuffleArray(pool).slice(0, count));
        }, []);
    }


    // 初始化题目元素
    function initQuestionElements() {
        // 清空题目容器
        questionContainer.innerHTML = '';
        
        // 确保有题目数据
        if (!window.selectedQuestions || window.selectedQuestions.length === 0) {
            console.error('没有可用的题目数据');
            questionContainer.innerHTML = '<div class="error-message">题目加载失败，请刷新页面重试</div>';
            return;
        }
        
        // 为每个题目创建DOM元素
        window.selectedQuestions.forEach((q, index) => {
            const questionPage = document.createElement('div');
            questionPage.className = `question-page ${index === 0 ? 'active' : ''}`;
            
            // 根据题型添加不同的类名
            const questionTypeClass = q.type === 'choice' ? 'choice-question' : 'fillblank-question';
            
            questionPage.innerHTML = `
                <div class="question-content ${questionTypeClass}">
                <span class="question-number">Q${index+1}</span>
                    <p class="question-text">
                        ${q.question}
                    </p>
                    ${q.type === 'choice' ? renderOptions(q, index) : renderFillBlank(q, index)}
                </div>`;
            questionContainer.appendChild(questionPage);
        });
    }
    
    // 渲染选择题选项
    function renderOptions(q, index) {
        // 检查选项格式
        if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
            console.error('题目选项格式错误:', q);
            return '<div class="error">选项数据错误</div>';
        }
        
        return `
        <div class="options-container">
            <ul class="options">
                ${q.options.map((opt, optIndex) => {
                    // 处理选项格式，支持多种格式
                    let optionLetter, optionText;
                    
                    if (typeof opt === 'string') {
                        if (opt.includes('.')) {
                            // 格式如 'A. 选项1'
                            const parts = opt.split('.');
                            optionLetter = parts[0].trim();
                            optionText = parts.slice(1).join('.').trim();
                        } else {
                            // 格式如 'A选项1' 或 'A'
                            optionLetter = opt.charAt(0);
                            optionText = opt.substring(1).trim();
                        }
                    } else if (Array.isArray(opt)) {
                        // 格式如 ['A', '选项1']
                        optionLetter = opt[0];
                        optionText = opt.slice(1).join(' ');
                    }
                    
                    // 如果无法解析，使用默认格式
                    if (!optionLetter) {
                        optionLetter = String.fromCharCode(65 + optIndex); // A, B, C...
                        optionText = opt;
                    }
                    
                    // 确保选项字母是单个字符
                    if (optionLetter.length > 1) {
                        optionLetter = optionLetter.charAt(0);
                    }
                    
                    return `
                    <li class="option option-${optionLetter.toLowerCase()}">
                        <input type="radio" 
                               name="q${index+1}" 
                               value="${optionLetter}" 
                               id="q${index+1}${optionLetter}">
                        <label for="q${index+1}${optionLetter}" class="choice-label">
                            <span class="option-letter">${optionLetter}</span>
                            <span class="option-text">${optionText}</span>
                        </label>
                    </li>`;
                }).join('')}
            </ul>
        </div>`;
    }
    
    // 渲染填空题
    function renderFillBlank(q, index) {
        // 如果填空题有选项，则渲染为单选题
        if (q.options && q.options.length > 0) {
            return renderOptions(q, index);
        }
        
        // 否则渲染为文本输入框
        return `
        <div class="fillblank-container">
            <div class="fillblank-group">
                <input type="text" 
                       class="fillblank-input smooth-type"
                       required
                       data-index="${index}">
                <label class="fillblank-label">请输入答案</label>
                <div class="input-bar"></div>
            </div>
        </div>`;
    }

    // 初始化侧边栏
    function initSidebar() {
        const questionList = document.querySelector('.question-list');
    questionList.innerHTML = '';

    window.selectedQuestions.forEach((_, index) => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.dataset.index = index;

        questionItem.innerHTML = `
        <div class="star">
            <input type="checkbox" class="checkbox">
            <div class="svg-container">
                <span class="question-number2">${index + 1}</span>
                <svg class="svg-outline" viewBox="0 0 24 24">
                    <path d="M12 2.5L9.45 8.5L3 9.06L7.725 13.39L6.25 19.82L12 16.5L17.75 19.82L16.275 13.39L21 9.06L14.55 8.5L12 2.5ZM12 4.75L14 9.33L18.7 9.75L15 13.07L16.18 17.75L12 15.16L7.82 17.75L9 13.07L5.3 9.75L10 9.33L12 4.75Z"/>
                </svg>
                <svg class="svg-filled" viewBox="0 0 24 24">
                    <path d="M12 2.5L9.45 8.5L3 9.06L7.725 13.39L6.25 19.82L12 16.5L17.75 19.82L16.275 13.39L21 9.06L14.55 8.5L12 2.5Z"/>
                </svg>
            </div>
        </div>`;

        questionItem.addEventListener('click', () => {
            showQuestion(index);
            // 添加点击涟漪效果
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            questionItem.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        questionList.appendChild(questionItem);
    });
        
        // 初始化侧边栏切换按钮
        document.querySelector('.sidebar-toggle').addEventListener('click', toggleSidebar);
        document.querySelector('.close-sidebar').addEventListener('click', closeSidebar);
        
        // 更新侧边栏状态
        updateSidebarStatus();
    }
    
    // 更新侧边栏状态
    function updateSidebarStatus() {
        const questionItems = document.querySelectorAll('.question-item');
        
        questionItems.forEach((item, index) => {
            const checkbox = item.querySelector('.checkbox');
            // 重置状态
            item.classList.remove('current', 'answered');
            checkbox.checked = false;
            
            // 当前题目
            if(index === currentIndex) {
                item.classList.add('current');
            }
            
            // 已回答题目
            if(userAnswers[index] !== null) {
                item.classList.add('answered');
                checkbox.checked = true;
            }
        });
        
        // 更新进度条
        const progress = (userAnswers.filter(a => a !== null).length / window.selectedQuestions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }

    // 打开侧边栏
    function openSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        sidebar.classList.add('show');
        sidebarToggle.style.visibility = 'hidden'; // 隐藏打开按钮
    }

    // 关闭侧边栏
    function closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        sidebar.classList.remove('show');
        sidebarToggle.style.visibility = 'visible'; // 显示打开按钮
    }

    // 切换侧边栏
    function toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar.classList.contains('show')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // 初始化题目事件
    function initQuestionEvents() {
        // 初始化选择题选项点击事件
        handleChoiceSelect();
        
        // 初始化填空题输入事件
        const fillInputs = document.querySelectorAll('.fillblank-input');
        fillInputs.forEach(input => {
            input.addEventListener('input', handleFillInput);
        });
        
        // 初始化导航按钮
        document.querySelector('.prev-btn').addEventListener('click', prevQuestion);
        document.querySelector('.next-btn').addEventListener('click', nextQuestion);
        
        // 初始化星形按钮事件
        initStarButtons();
    }
    
    // 初始化星形按钮事件
    function initStarButtons() {
        // 防止复选框点击事件冒泡
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 获取题目索引
                const questionItem = e.target.closest('.question-item');
                const index = parseInt(questionItem.dataset.index);
                
                // 如果题目已回答，允许切换复选框状态
                if (userAnswers[index] !== null) {
                    // 不阻止默认行为，允许复选框状态切换
                } else {
                    // 如果题目未回答，阻止复选框状态切换
                    e.preventDefault();
                }
                
                // 跳转到对应题目
                showQuestion(index);
            });
        });
        
        // 星形按钮的SVG点击事件
        document.querySelectorAll('.svg-container').forEach(container => {
            container.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 获取题目索引
                const questionItem = e.target.closest('.question-item');
                const index = parseInt(questionItem.dataset.index);
                
                // 跳转到对应题目
                showQuestion(index);
            });
        });
    }
    
    // 处理选择题选择
function handleChoiceSelect() {
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            // 只修改当前题目的选项状态
            const questionPage = this.closest('.question-page');
            if (!questionPage || !questionPage.classList.contains('active')) return;

            // 移除当前题目所有选项的选中状态
            questionPage.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // 设置当前选项为选中状态
            this.classList.add('selected');
            
            // 保存用户答案
            const selectedOption = this.querySelector('.option-letter').textContent;
            userAnswers[currentIndex] = selectedOption;
            
            // 更新侧边栏状态
            updateSidebarStatus();
        });
    });
}
    
    // 处理填空题输入
    function handleFillInput(e) {
        // 保存用户答案
        userAnswers[currentIndex] = e.target.value;
        
        // 如果用户输入了答案，更新侧边栏状态
        if (e.target.value.trim() !== '') {
            updateSidebarStatus();
        }
    }

    // 更新界面状态
    function updateUI() {
        currentQuestion.textContent = currentIndex + 1;
        
        // 更新按钮文本
        nextBtn.textContent = currentIndex === window.selectedQuestions.length - 1 
            ? '交卷' 
            : '下一题';
            
        // 控制上一题按钮显示
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'inline-block';
    }

    // 显示指定题目
    function showQuestion(index) {
        // 确保索引有效
        if (index < 0 || index >= window.selectedQuestions.length) {
            console.error('无效的题目索引:', index);
            return;
        }
        
        currentIndex = index;
        
        // 更新题目显示
        document.querySelectorAll('.question-page').forEach((page, i) => {
            page.classList.toggle('active', i === index);
        });

        // 恢复当前题目的选项高亮状态
    const currentQuestionPage = document.querySelectorAll('.question-page')[index];
    const options = currentQuestionPage.querySelectorAll('.option');
    const currentAnswer = userAnswers[index];
    
    options.forEach(option => {
        const optionValue = option.querySelector('input').value;
        option.classList.toggle('selected', optionValue === currentAnswer);
    });
    
        updateUI();
        updateSidebarStatus();
    }

    // 题目导航
    function prevQuestion() {
        if (currentIndex > 0) showQuestion(currentIndex - 1);
    }

    function nextQuestion() {
        if (currentIndex < window.selectedQuestions.length - 1) {
            showQuestion(currentIndex + 1);
        } else {
            submitQuiz();
        }
    }

    // 状态变量
    let reviewData = [];

    // 计算分数函数 - 每道题10分
    function calculateScore() {
        // 每道题的分值
        const POINTS_PER_QUESTION = 10; // 默认每题10分
        
        return window.selectedQuestions.reduce((acc, q, index) => {
            // 检查答案是否正确
            const isCorrect = String(userAnswers[index] || '').toLowerCase() === 
                            String(q.correct_answer || '').toLowerCase();
            
            // 当前使用统一分值
            const points = isCorrect ? POINTS_PER_QUESTION : 0;
            
            return acc + points;
        }, 0);
    }

    // 提交测验
    function submitQuiz() {
        generateReviewData();
        
        const scoreLayer = document.querySelector('.score-layer');
        const cards = document.querySelector('.cards');
        
        // 计算分数
        const score = calculateScore();
        const totalQuestions = window.selectedQuestions.length;
        
        
        // 更新分数显示
        document.querySelector('.score-value').textContent = score;
        
        // 计算用时
        const endTime = new Date();
        const timeSpent = Math.floor((endTime - startTime) / 1000); // 秒为单位
        let timeText = '';
        
        if (timeSpent < 60) {
            timeText = `${timeSpent}秒`;
        } else {
            const minutes = Math.floor(timeSpent / 60);
            const seconds = timeSpent % 60;
            timeText = `${minutes}分${seconds}秒`;
        }
        
        document.querySelector('.time-value').textContent = timeText;
        
        // 显示分数层
        scoreLayer.style.display = 'flex';
        
        // 检测是否为移动设备，自动展开详情
        if (window.innerWidth <= 768 || 'ontouchstart' in window) {
            setTimeout(() => {
                cards.classList.add('auto-expand');
            }, 1000);
        }
        
        // 保存练习记录
        saveHomeworkReview(score,timeText,reviewData);
        
        // 绑定按钮事件
        document.querySelector('.review-btn').onclick = () => {
            scoreLayer.style.display = 'none';
            showReviewLayer();
        };
        
        document.querySelector('.restart-btn').onclick = restartQuiz;
    }

    // 重置分数卡
    function resetScoreCard() {
        const cards = document.querySelector('.cards');
        cards.classList.remove('auto-expand');
    }

    // 生成题目回顾数据
    function generateReviewData() {
        reviewData = window.selectedQuestions.map((q, index) => {
        const userAnswer = String(userAnswers[index] || '').trim();
        const correctAnswer = String(q.correct_answer || '').trim();
        let isCorrect = false;

        if (q.type === 'fill_blank') {
            const userNum = parseFloat(userAnswer.replace(/[^0-9.]/g, ''));
            const correctNum = parseFloat(correctAnswer.replace(/[^0-9.]/g, ''));
            isCorrect = !isNaN(userNum) && userNum === correctNum;
        } else {
            
            isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        }
            return {
                question: q.question,
                userAnswer: userAnswers[index] || '未回答',
                correctAnswer: q.correct_answer,
                explanation: q.explanation,
                isCorrect: isCorrect,
                type: q.type,
                options: q.options,
                displayIndex: index + 1
            };
        });
    }

    // 显示回顾层
    function showReviewLayer() {
        const reviewLayer = document.querySelector('.review-layer');
        const reviewList = document.querySelector('.review-list');
        
        // 清空之前的内容
        reviewList.innerHTML = '';
        
        // 生成题目卡片
        reviewList.innerHTML = reviewData.map((item, index) => `
            <div class="review-card ${item.type === 'choice' ? 'choice-review' : 'fillblank-review'}">
                <div class="question-number1">第 ${item.displayIndex} 题</div>
                <div class="review-question">${item.question}</div>
                
                <div class="answer-status ${item.isCorrect ? 'correct' : 'wrong'}">
                    ${item.isCorrect ? '✅ 回答正确' : '❌ 回答错误'}
                </div>

                ${item.type === 'choice' ? `
                    <div class="user-answer">你的选择：${item.userAnswer}</div>
                ` : `
                    <div class="user-answer">你的答案：${item.userAnswer}</div>
                `}

                <div class="correct-answer">
                    正确答案：${item.correctAnswer}
                </div>

                ${item.explanation ? `
                    <div class="explanation">
                        <strong>解析：</strong>${item.explanation}
                    </div>
                ` : ''}
            </div>
        `).join('');

        // 显示回顾层
        reviewLayer.style.display = 'block';
        
        // 添加卡片动画
        const cards = document.querySelectorAll('.review-card');
        cards.forEach((card, index) => {
            card.style.animation = `cardEnter 0.5s ease ${index * 0.1}s both`;
        });
    }

    // 关闭回顾层
    document.querySelector('.close-review').addEventListener('click', () => {
        document.querySelector('.review-layer').style.display = 'none';
    });

    // 重新开始测验
    async function restartQuiz() {
        // 关闭所有层
        document.querySelector('.score-layer').style.display = 'none';
        document.querySelector('.review-layer').style.display = 'none';
        
        // 重置状态
        currentIndex = 0;
        startTime = new Date(); // 重置开始时间
        
        
        // 重新初始化
        initQuestionElements();
        initSidebar();
        initQuestionEvents();
        
        // 更新总题数显示
        totalQuestions.textContent = window.selectedQuestions.length;
        
        // 重置用户答案
        userAnswers = new Array(window.selectedQuestions.length).fill(null);
        
        // 显示第一题
        showQuestion(0);
        
        // 重置分数卡
        resetScoreCard();
    }

    // 事件绑定
    prevBtn.addEventListener('click', prevQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    
    // 绑定重新开始按钮
    document.querySelectorAll('.restart-btn').forEach(btn => {
        btn.addEventListener('click', restartQuiz);
    });

    // 继续挑战按钮
    document.querySelector('.challenge-btn').addEventListener('click', continueChallenge); 

    // 保存课后练习记录
    function saveHomeworkReview(score, timeText,reviewData) {
        const questions = reviewData.map(q => ({
            type: q.type,
            question: q.question,
            options: q.type === 'choice' ? q.options : null,
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
            isCorrect: q.isCorrect,
            explanation: q.explanation
        }));
        
        
        // 创建回顾记录对象
        const review = {
            date: new Date().toISOString(),
            score: score,
            time: timeText,
            questions: questions,
            questionSetInfo: {
                setName: currentSetName || 'default',
                totalQuestions: reviewData.length,
                choiceCount: reviewData.filter(q => q.type === 'choice').length,
                fillBlankCount: reviewData.filter(q => q.type === 'fill_blank').length
            }
        };
        
        // 保存到localStorage
        const key = 'homework_reviews';
        let reviews = localStorage.getItem(key);
        reviews = reviews ? JSON.parse(reviews) : [];
        reviews.push(review);
        localStorage.setItem(key, JSON.stringify(reviews));
        
        console.log('课后练习记录已保存');
    }

    let usedQuestionSets = [];
    // 优化题库选择逻辑 - 添加继续挑战功能
    function continueChallenge() {
        // 随机选择一个不同的题库
        const allSets = ['default', 'q2_error', 'q3_error', 'q2_q3_error', 'q5_error'];
        const currentSet = 'default';
        
        // 移除当前使用的题库
        const availableSets = allSets.filter(set => !usedQuestionSets.includes(set));
        // 如果全部用过则重置
        if (availableSets.length === 0) {
            usedQuestionSets = [];
            availableSets = [...allSets];
        }
        // 随机选择新题组
        const newSet = availableSets[Math.floor(Math.random() * availableSets.length)];
        usedQuestionSets.push(newSet);
        
       // 使用新题组初始化
    currentSetName = newSet;
    currentQuestions = loadQuestionSet(newSet);
    window.selectedQuestions = currentQuestions;
    
    // 重置状态并重新开始
    restartQuiz();
    }

    // 初始化系统
    init();
});
// classroom.js
// 课堂练习专用逻辑
const CORRECT_ANSWERS = { q1: 'B', q2: 'B', q3: 'A', q4: 'B' ,q5:'C'};
let currentIndex = 0;

// 测试模式开关（true: 不保存进度，false: 正常记录）
const TEST_MODE = false; 

// ======================= 测试辅助功能 =======================
// 注意：此部分代码仅用于开发测试，上线前请删除
// 添加快捷键组合 Ctrl+Shift+R 重置所有进度，模拟首次访问
document.addEventListener('keydown', function(event) {
    // 检测 Ctrl+Shift+R 组合键
    if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        // 防止浏览器默认刷新行为
        event.preventDefault();
        
        // 清除所有相关的本地存储
        const keysToReset = [
            'classProgress', 
            'classPerformance', 
            'completionShown', 
            'answeredQuestions'
        ];
        
        keysToReset.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
        
        // 重置DOM状态
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
            radio.disabled = false;
        });
        
        // 移除所有正确/错误标记
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
            const icon = option.querySelector('.icon-correct, .icon-incorrect');
            if(icon) icon.remove();
        });
        
        // 隐藏完成层
        document.querySelector('.complete-layer').style.display = 'none';
        
        // 重置当前索引并切换到第一题
        currentIndex = 0;
        const pages = document.querySelectorAll('.question-page');
        pages.forEach(page => page.classList.remove('active'));
        pages[0].classList.add('active');
        
        // 重置进度显示
        document.getElementById('progress-count').textContent = '0';
        
        console.log('%c[测试模式] 所有进度已重置，模拟首次访问', 'background:#ff9800;color:white;padding:4px 8px;border-radius:4px');
        
        // 显示临时提示
        const resetNotice = document.createElement('div');
        resetNotice.className = 'feedback success';
        resetNotice.textContent = '已重置所有进度！';
        resetNotice.style.backgroundColor = '#ff9800';
        resetNotice.style.color = 'white';
        document.querySelector('.quiz-container').appendChild(resetNotice);
        setTimeout(() => resetNotice.remove(), 2000);
    }
});

// 添加测试控制面板（可选，取消注释启用）
/*
function addTestPanel() {
    const panel = document.createElement('div');
    panel.className = 'test-panel';
    panel.innerHTML = `
        <div class="test-panel-header">测试控制面板</div>
        <button id="test-reset-all">重置所有进度</button>
        <button id="test-complete-all">一键完成所有题目</button>
        <div class="test-panel-footer">仅用于测试 - 上线前删除</div>
    `;
    
    // 样式
    const style = document.createElement('style');
    style.textContent = `
        .test-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 8px;
            z-index: 9999;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .test-panel-header {
            font-weight: bold;
            margin-bottom: 8px;
            text-align: center;
            color: #ff9800;
        }
        .test-panel button {
            display: block;
            width: 100%;
            margin: 5px 0;
            padding: 5px;
            background: #444;
            border: none;
            color: white;
            border-radius: 4px;
            cursor: pointer;
        }
        .test-panel button:hover {
            background: #666;
        }
        .test-panel-footer {
            margin-top: 8px;
            font-size: 10px;
            color: #aaa;
            text-align: center;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(panel);
    
    // 事件处理
    document.getElementById('test-reset-all').addEventListener('click', function() {
        // 触发重置功能
        const event = new KeyboardEvent('keydown', {
            key: 'R',
            ctrlKey: true,
            shiftKey: true
        });
        document.dispatchEvent(event);
    });
    
    document.getElementById('test-complete-all').addEventListener('click', function() {
        // 一键完成所有题目
        const answers = {q1: 'B', q2: 'B', q3: 'A', q4: 'B', q5: 'C'};
        const progress = {};
        const answeredQuestions = {};
        
        // 设置所有答案
        Object.keys(answers).forEach(questionId => {
            progress[questionId] = answers[questionId];
            answeredQuestions[questionId] = true;
        });
        
        // 保存进度
        localStorage.setItem('classProgress', JSON.stringify(progress));
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
        localStorage.setItem('classPerformance', JSON.stringify({
            correct: 5,
            total: 5,
            errors: []
        }));
        
        // 刷新页面
        location.reload();
    });
}

// 在页面加载完成后添加测试面板
window.addEventListener('load', function() {
    // 仅在开发环境添加测试面板
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addTestPanel();
    }
});
*/
// ======================= 测试辅助功能结束 =======================

document.addEventListener('DOMContentLoaded', () => {
    // 初始化时清除测试数据
    if(TEST_MODE) {
        // 强制清除痕迹
        ['classProgress', 'classPerformance'].forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
        console.log('[测试模式] 存储数据已重置');
        
        // 重置DOM状态
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        document.querySelector('.complete-layer').style.display = 'none';
        currentIndex = 0;
        switchQuestion(0);
    }
    // 初始化进度
    function initProgress() {
        if(!TEST_MODE && localStorage.getItem('classroom_reset') !== 'true') {
            ['classProgress', 'classPerformance'].forEach(k => localStorage.removeItem(k));
            localStorage.setItem('classroom_reset', 'true');
        }
        completionShown = false;
        if(!localStorage.getItem('classProgress')) {
            localStorage.setItem('classProgress', JSON.stringify({}));
        }
        if(!localStorage.getItem('classPerformance')) {
            localStorage.setItem('classPerformance', JSON.stringify({
                correct: 0,
                total: 0,
                errors: [] // 记录错题ID
            }));
        }
        
        // 检查是否已经显示过完成界面
        if(localStorage.getItem('completionShown') === 'true') {
            completionShown = true;
        }
        
        restoreProgress();
        updateProgressDisplay();
        
        // 自动跳转到未完成的题目
        jumpToUnansweredQuestion();
        
        // 检查是否已完成
        checkCompletion();
    }

    // 恢复已保存的进度
    function restoreProgress() {
        const progress = JSON.parse(localStorage.getItem('classProgress') || '{}');
        const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '{}');
        
        Object.keys(progress).forEach(questionId => {
            const input = document.querySelector(`input[name="${questionId}"][value="${progress[questionId]}"]`);
            if(input) {
                input.checked = true;
                
                // 如果题目已经回答过，恢复标记并禁用选项
                if(answeredQuestions[questionId]) {
                    const questionPage = document.querySelector(`.question-page:has(input[name="${questionId}"])`);
                    if(questionPage) {
                        const options = questionPage.querySelectorAll('.option');
                        const correctValue = CORRECT_ANSWERS[questionId];
                        
                        options.forEach(option => {
                            const optionInput = option.querySelector('input');
                            optionInput.disabled = true;
                            
                            // 清除可能存在的旧标记
                            const existingIcon = option.querySelector('.icon-correct, .icon-incorrect');
                            if(existingIcon) existingIcon.remove();
                            
                            // 添加正确/错误标记
                            if(optionInput.value === correctValue) {
                                option.classList.add('correct');
                                option.innerHTML += '<span class="icon-correct">✓</span>';
                            } else if(optionInput.value === progress[questionId] && progress[questionId] !== correctValue) {
                                option.classList.add('incorrect');
                                option.innerHTML += '<span class="icon-incorrect">✗</span>';
                            }
                        });
                    }
                }
            }
        });
    }

    // 保存答题进度
    let completionShown = false; 
    function saveProgress(questionId, answer) {
        if(TEST_MODE) {
            // 测试模式模拟完成状态
            if(++currentIndex >= 4 && !completionShown) {
                document.querySelector('.complete-layer').style.display = 'flex';
                completionShown = true;
            }
            return;
        }
        
        const progress = JSON.parse(localStorage.getItem('classProgress') || '{}');
        const performance = JSON.parse(localStorage.getItem('classPerformance') || '{"correct":0,"total":0,"errors":[]}');
        
        // 如果是第一次回答这个问题，增加总数
        if(!progress[questionId]) {
            performance.total++;
        }
        
        // 保存答案
        progress[questionId] = answer;
        
        // 检查答案是否正确
        if(answer === CORRECT_ANSWERS[questionId]) {
            // 如果之前答错过，现在答对了，从错题列表中移除
            const errorIndex = performance.errors.indexOf(questionId);
            if(errorIndex !== -1) {
                performance.errors.splice(errorIndex, 1);
                performance.correct++; // 增加正确数
            } else if(!progress[questionId]) {
                // 如果是第一次回答且正确
                performance.correct++;
            }
        } else {
            // 答案错误，添加到错题列表
            if(!performance.errors.includes(questionId)) {
                performance.errors.push(questionId);
            }
        }
        
        localStorage.setItem('classProgress', JSON.stringify(progress));
        localStorage.setItem('classPerformance', JSON.stringify(performance));
        
        updateProgressDisplay();
        checkCompletion();
    }

    // 更新进度显示
    function updateProgressDisplay() {
        const progress = JSON.parse(localStorage.getItem('classProgress') || '{}');
        const answeredCount = Object.keys(progress).length;
        document.getElementById('progress-count').textContent = answeredCount;
    }

    // 检查是否完成
    function checkCompletion() {
        const progress = JSON.parse(localStorage.getItem('classProgress') || '{}');
        if(Object.keys(progress).length === 5 && !completionShown) {
            document.querySelector('.complete-layer').style.display = 'flex';
            localStorage.setItem('completionShown', 'true'); // 设置完成标记
            completionShown = true;
            
            // 计算得分
            const score = calculateScore();
            
            // 保存练习记录
            saveClassroomReview(score);
        }
    }

    // 计算得分
    function calculateScore() {
        let correctCount = 0;
        let totalScore = 0;
        
        // 检查每道题的答案
        for (let i = 1; i <= 5; i++) {
            const userAnswer = localStorage.getItem(`classroom_q${i}`);
            let correctAnswer;
            
            // 获取正确答案（这里需要根据您的题目数据结构调整）
            switch(i) {
                case 1: correctAnswer = 'B'; break; // 烙1张饼需要几分钟
                case 2: correctAnswer = 'B'; break; // 烙3张饼最少需要多久
                case 3: correctAnswer = 'A'; break; // 烙5张饼最少需要多久
                case 4: correctAnswer = 'B'; break; // 烙6张饼最少需要多久
                case 5: correctAnswer = 'C'; break; // 福建舰起飞9架飞机最短用时
            }
            
            if (userAnswer === correctAnswer) {
                correctCount++;
            }
        }
        
        // 每题20分，总分100分
        totalScore = correctCount * 20;
        return totalScore;
    }

    // 保存课堂练习记录
    function saveClassroomReview(score) {
        const key = 'classroom_reviews';
        let reviews = JSON.parse(localStorage.getItem(key) || '[]');
    
        // 保留其他类型记录，仅删除课堂练习记录
        const filtered = reviews.filter(r => !r.date.includes('T')); 
        
        // 创建回顾记录对象
        const review = {
            date: new Date().toISOString(),
            score: score,
            time: '未记录', // 课堂练习未记录时间
            questions: questions
        };
        
        // 保存到localStorage
        if (typeof window.saveReviewToStorage === 'function') {
            window.saveReviewToStorage(review, 'classroom');
        } else {
            const key = 'classroom_reviews';
            let reviews = JSON.parse(localStorage.getItem(key) || '[]');
            reviews.push(review); 
            localStorage.setItem(key, JSON.stringify(reviews));
        }
        
        console.log('课堂练习记录已保存');
    }

    // 标记答案并禁用选项
    function markAnswers(questionId, selectedValue) {
        const options = document.querySelectorAll(`.question-page.active .option`);
        const correctValue = CORRECT_ANSWERS[questionId];
        
        options.forEach(option => {
            option.classList.remove('correct', 'incorrect');
            const input = option.querySelector('input');
            const value = input.value;
            
            // 禁用所有选项
            input.disabled = true;
            
            // 添加正确/错误标记
            if (value === correctValue) {
                option.classList.add('correct');
                option.innerHTML += '<span class="icon-correct">✓</span>';
            } else if (value === selectedValue && selectedValue !== correctValue) {
                option.classList.add('incorrect');
                option.innerHTML += '<span class="icon-incorrect">✗</span>';
            }
        });
        
        // 记录该题已被回答
        const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '{}');
        answeredQuestions[questionId] = true;
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    }

    // 自动跳转到未完成的题目
    function jumpToUnansweredQuestion() {
        const progress = JSON.parse(localStorage.getItem('classProgress') || '{}');
        
        // 如果已经完成所有题目，不需要跳转
        if(Object.keys(progress).length === 5) return;
        
        // 查找第一个未完成的题目
        for(let i = 1; i <= 5; i++) {
            const questionId = `q${i}`;
            if(!progress[questionId]) {
                switchQuestion(i - 1);
                break;
            }
        }
    }

    // 题目切换逻辑
    document.querySelector('.next-btn').addEventListener('click', () => {
        const currentQuestion = `q${currentIndex + 1}`;
        const selected = document.querySelector(`input[name="${currentQuestion}"]:checked`);
        
        // 检查是否已经回答过
        const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '{}');
        const progress = JSON.parse(localStorage.getItem('classProgress') || '{}');
        
        // 如果题目已经回答过，直接进入下一题
        if(answeredQuestions[currentQuestion] || progress[currentQuestion]) {
            if(currentIndex < 4) {
                switchQuestion(currentIndex + 1);
            }
            return;
        }
        
        // 如果是新题目，需要检查是否选择了答案
        if (!selected) {
            showFeedback('请先选择答案！', false);
            return;
        }
        
        // 如果是第一次回答，显示反馈并标记
        // 标记答案
        markAnswers(currentQuestion, selected.value);
        
        // 保存答案
        saveProgress(currentQuestion, selected.value);
        
        // 显示反馈
        const isCorrect = selected.value === CORRECT_ANSWERS[currentQuestion];
        showFeedback(isCorrect ? '回答正确！' : '回答错误', isCorrect);
        
        // 延迟进入下一题
        setTimeout(() => {
            if(currentIndex < 4) {
                switchQuestion(currentIndex + 1);
            }
        }, 1500);
    });

    document.querySelector('.prev-btn').addEventListener('click', () => {
        if(currentIndex > 0) {
            switchQuestion(currentIndex - 1);
        }
    });

    // 显示反馈的样式
    function showFeedback(message, isSuccess = true) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${isSuccess ? 'success' : 'error'}`;
        feedback.textContent = message;
        
        document.querySelector('.quiz-container').appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }

    function switchQuestion(newIndex) {
        const pages = document.querySelectorAll('.question-page');
        pages[currentIndex].classList.remove('active');
        currentIndex = newIndex;
        pages[currentIndex].classList.add('active');
        
        // 恢复当前题目的标记状态
        const questionId = `q${currentIndex + 1}`;
        const progress = JSON.parse(localStorage.getItem('classProgress') || '{}');
        const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '{}');
        
        if(progress[questionId]) {
            // 如果题目已经有答案，标记为已回答
            if(!answeredQuestions[questionId]) {
                answeredQuestions[questionId] = true;
                localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
            }
            
            // 恢复标记状态
            const options = document.querySelectorAll(`.question-page.active .option`);
            const correctValue = CORRECT_ANSWERS[questionId];
            
            options.forEach(option => {
                option.classList.remove('correct', 'incorrect');
                const input = option.querySelector('input');
                const value = input.value;
                
                // 禁用所有选项
                input.disabled = true;
                
                // 清除可能存在的旧标记
                const existingIcon = option.querySelector('.icon-correct, .icon-incorrect');
                if(existingIcon) existingIcon.remove();
                
                // 添加正确/错误标记
                if(value === correctValue) {
                    option.classList.add('correct');
                    option.innerHTML += '<span class="icon-correct">✓</span>';
                } else if(value === progress[questionId] && progress[questionId] !== correctValue) {
                    option.classList.add('incorrect');
                    option.innerHTML += '<span class="icon-incorrect">✗</span>';
                }
            });
        } else {
            // 重置选项状态
            const options = document.querySelectorAll(`.question-page.active .option`);
            options.forEach(option => {
                option.classList.remove('correct', 'incorrect');
                const input = option.querySelector('input');
                input.disabled = false;
                
                // 移除可能存在的图标
                const icon = option.querySelector('.icon-correct, .icon-incorrect');
                if(icon) icon.remove();
            });
        }
    }

    // 选项选择事件
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            // 只记录选择，不自动跳转
            const questionId = e.target.name;
            const answer = e.target.value;
            // 不在这里保存进度，而是在点击下一题时保存
        });
    });

    // 跳转按钮事件
    document.getElementById('goto-homework').addEventListener('click', () => {
        if(TEST_MODE) {
            // 测试模式强制跳转
            window.location.href = 'test.html?testmode=true';
            return;
        }

        const progress = JSON.parse(localStorage.getItem('classProgress') || '{}');
        const performance = JSON.parse(localStorage.getItem('classPerformance') || '{"correct":0,"total":0,"errors":[]}');
        
        if(Object.keys(progress).length === 5) {
            // 根据错题情况设置题组参数
            let questionSet = 'default';
            
            // 检查错题情况
            if(performance.errors.includes('q2') && performance.errors.includes('q3')) {
                questionSet = 'q2_q3_error';
            } else if(performance.errors.includes('q2')) {
                questionSet = 'q2_error';
            } else if(performance.errors.includes('q3')) {
                questionSet = 'q3_error';
            } else if(performance.errors.includes('q5')) {
                questionSet = 'q5_error';
            }
            
            // 将题组信息保存到sessionStorage，供test.html页面读取
            sessionStorage.setItem('selectedQuestionSet', questionSet);
            console.log(`[题组选择] 根据错题情况选择题组: ${questionSet}`);
            
            window.location.href = 'test.html';
        } else {
            alert('请先完成所有课堂练习题！');
        }
    });

    // 添加"继续课后练习"按钮事件
    const gotoHomeworkBtn = document.getElementById('goto-homework');
    if (gotoHomeworkBtn) {
        gotoHomeworkBtn.addEventListener('click', function() {
            window.location.href = 'test.html';
        });
    }
    
    // 添加一个"查看记录"按钮
    const completeLayer = document.querySelector('.complete-layer');
    if (completeLayer && !document.getElementById('view-review-btn')) {
        const viewReviewBtn = document.createElement('button');
        viewReviewBtn.id = 'view-review-btn';
        viewReviewBtn.textContent = '查看记录';
        viewReviewBtn.style.marginTop = '10px';
        viewReviewBtn.addEventListener('click', function() {
            window.location.href = 'review.html';
        });
        completeLayer.appendChild(viewReviewBtn);
    }

    // 初始化
    initProgress();
});
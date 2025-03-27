// review.js - 习题回顾功能实现

document.addEventListener('DOMContentLoaded', function() {
    // 初始化子导航切换功能
    initSubnav();
    
    // 加载回顾数据
    loadReviewData();
    
    // 初始化详细回顾弹出层事件
    initDetailReview();
});

// 子导航切换功能
function initSubnav() {
    const subnavItems = document.querySelectorAll('.subnav-item');
    const reviewSections = document.querySelectorAll('.review-section');
    
    subnavItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active类
            subnavItems.forEach(i => i.classList.remove('active'));
            reviewSections.forEach(s => s.classList.remove('active'));
            
            // 添加active类到当前选中项
            this.classList.add('active');
            const type = this.dataset.type;
            document.getElementById(`${type}-review`).classList.add('active');
        });
    });
}

// 加载回顾数据
function loadReviewData() {
    // 加载课堂练习回顾数据
    loadClassroomReviews();
    
    // 加载课后练习回顾数据
    loadHomeworkReviews();
}

// 加载课堂练习回顾数据
function loadClassroomReviews() {
    const classroomCards = document.getElementById('classroom-cards');
    const classroomReviews = getReviewsFromStorage('classroom');
    
    if (classroomReviews && classroomReviews.length > 0) {
        // 清空容器
        classroomCards.innerHTML = '';
        
        // 按时间降序排序
        classroomReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 渲染卡片
        classroomReviews.forEach((review, index) => {
            const card = createReviewCard(review, 'classroom', index);
            classroomCards.appendChild(card);
        });
    }
}

// 加载课后练习回顾数据
function loadHomeworkReviews() {
    const homeworkCards = document.getElementById('homework-cards');
    const homeworkReviews = getReviewsFromStorage('homework');
    
    if (homeworkReviews && homeworkReviews.length > 0) {
        // 清空容器
        homeworkCards.innerHTML = '';
        
        // 按时间降序排序
        homeworkReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 渲染卡片
        homeworkReviews.forEach((review, index) => {
            const card = createReviewCard(review, 'homework', index);
            homeworkCards.appendChild(card);
        });
    }
}

// 从localStorage获取回顾数据
function getReviewsFromStorage(type) {
    const key = `${type}_reviews`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
// 计算正确率
function calculateAccuracy(review) {
    const correct = review.questions.filter(q => q.isCorrect).length;
    return Math.round((correct / review.questions.length) * 100);
}
// 创建回顾卡片
function createReviewCard(review, type, index) {
    const card = document.createElement('div');
    card.className = 'review-card-item';
    card.dataset.type = type;
    card.dataset.index = index;
    
    // 计算正确率
    const correctCount = review.questions.filter(q => q.isCorrect).length;
    const totalCount = review.questions.length;
    const correctRate = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    
    const displayScore = review.score || 0;
    
    // 格式化日期
    const date = new Date(review.date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    // 卡片标题
    const title = type === 'classroom' ? '课堂练习' : '课后练习';
    
    card.innerHTML = `
        <span class="review-type-tag tag-${type}">${title}</span>
        <h3 class="review-card-title">${title} #${index + 1}</h3>
        <div class="review-card-stats">
            <div class="review-card-stat">
                <span class="stat-number">${
                    type === 'classroom' ? `${review.score}/100` : review.score
                }</span>
                <span class="stat-label">得分</span>
            </div>
            <div class="review-card-stat">
                <span class="stat-number">${correctRate}%</span>
                <span class="stat-label">正确率</span>
            </div>
            ${
                type === 'homework' 
                ? `<div class="review-card-stat">
                    <span class="stat-number">${review.time || '00:00'}</span>
                    <span class="stat-label">用时</span>
                   </div>`
                : ''
            }
        </div>
        <div class="review-card-date">${formattedDate}</div>
    `;

    
    // 添加点击事件
    card.addEventListener('click', function() {
        showDetailReview(type, index);
    });
    
    return card;
}

// 初始化详细回顾弹出层事件
function initDetailReview() {
    // 关闭按钮事件
    document.querySelector('.close-detail').addEventListener('click', function() {
        document.querySelector('.detail-review-overlay').classList.remove('active');
    });
    
    // 点击遮罩层关闭
    document.querySelector('.detail-review-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}

// 显示详细回顾
function showDetailReview(type, index) {
    let reviews = getReviewsFromStorage(type);

    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (!reviews || !reviews[index]) return;
    
    const review = reviews[index];
    const overlay = document.querySelector('.detail-review-overlay');

    const totalQuestions = review.questions.length;
    const correctCount = review.questions.filter(q => q.isCorrect).length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    
    // 设置标题
    document.querySelector('.detail-title').textContent = type === 'classroom' ? '课堂练习详情' : '课后练习详情';
    
    // 安全设置元素内容
    const setElementText = (selector, text) => {
        const el = document.querySelector(selector);
        el && (el.textContent = text);
    };

    // 设置统计信息（使用更新后的选择器）
    setElementText('.stat-total', totalQuestions);
    setElementText('.stat-correct', correctCount);
    setElementText('.stat-accuracy', `${accuracy}%`);
    setElementText('.time-value', review.time || '00:00');
    setElementText('.date-value', new Date(review.date).toLocaleString());

    // 渲染题目
    renderDetailQuestions(review.questions);
    
    // 显示弹出层
    overlay.classList.add('active');
}

// 渲染详细题目信息
function renderDetailQuestions(questions) {
    const container = document.querySelector('.detail-questions');
    container.innerHTML = '';
    
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'detail-question';
        
        // 状态标签
        const statusClass = q.isCorrect ? 'status-correct' : 'status-incorrect';
        const statusText = q.isCorrect ? '正确' : '错误';
        
        let questionContent = `
            <div class="question-status ${statusClass}">${statusText}</div>
            <div class="detail-question-text">${index + 1}. ${q.question}</div>
        `;
        
        // 根据题目类型渲染不同的选项
        if (q.type === 'choice') {
            questionContent += '<div class="detail-options">';
            
            q.options.forEach((option, optIndex) => {
                const letter = String.fromCharCode(65 + optIndex); // A, B, C...
                const isSelected = q.userAnswer === letter;
                const isCorrect = q.correctAnswer === letter;
                
                let optionClass = '';
                if (isSelected && isCorrect) {
                    optionClass = 'selected-correct';
                } else if (isSelected && !isCorrect) {
                    optionClass = 'selected-incorrect';
                } else if (isCorrect) {
                    optionClass = 'correct';
                }
                
                questionContent += `
                    <div class="detail-option ${optionClass}">
                        ${option}
                    </div>
                `;
            });
    questionContent += '</div>';
        } else if (q.type === 'fill_blank') {
            questionContent += `
                <div class="detail-options">
                    <div class="detail-option ${q.isCorrect ? 'selected-correct' : 'selected-incorrect'}">
                        你的答案: ${q.userAnswer || '未作答'}
                    </div>
                    <div class="detail-option correct">
                        正确答案: ${q.correctAnswer}
                    </div>
                </div>
            `;
        }
        
        // 解析
        if (q.explanation) {
            questionContent += `
                <div class="detail-explanation">
                    <div class="explanation-title">解析:</div>
                    <div>${q.explanation}</div>
                </div>
            `;
        }
        
        questionDiv.innerHTML = questionContent;
        container.appendChild(questionDiv);
    });
}

// 保存回顾数据到localStorage
function saveReviewToStorage(review, type) {
    const key = `${type}_reviews`;
    let reviews = getReviewsFromStorage(type);
    
    // 添加新的回顾记录
    reviews.push(review);
    
    // 保存回到localStorage
    localStorage.setItem(key, JSON.stringify(reviews));
}

// 导出保存回顾数据的函数，供其他JS文件使用
window.saveReviewToStorage = saveReviewToStorage;

// 页面切换功能
        document.querySelectorAll('.infinite-item').forEach(item => {
            item.addEventListener('click', function() {
                // 移除所有active类
                document.querySelectorAll('.infinite-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

                // 添加active类到当前项
                this.classList.add('active');

                // 显示对应页面
                const pageId = this.dataset.page + '-page';
                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.classList.add('active');
                }
            });
        });

        // 实时更新时间
        function updateTime() {
            const now = new Date();
            const timeElement = document.getElementById('current-time');
            const dateElement = document.getElementById('current-date');

            // 格式化时间
            const timeString = now.toLocaleTimeString('zh-CN', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // 格式化日期
            const dateString = now.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short'
            });

            timeElement.textContent = timeString;
            dateElement.textContent = dateString;

        }

        // 动态问候语
        function updateGreeting() {
            const hour = new Date().getHours();
            const greetingElement = document.getElementById('dynamic-greeting');
            let greeting = '';

            if (hour >= 5 && hour < 12) {
                greeting = '早晨好，启程者！';
            } else if (hour >= 12 && hour < 14) {
                greeting = '中午好，修行者！';
            } else if (hour >= 14 && hour < 18) {
                greeting = '下午好，创造者！';
            } else if (hour >= 18 && hour < 22) {
                greeting = '晚上好，沉思者！';
            } else {
                greeting = '夜深了，守望者！';
            }

            greetingElement.textContent = greeting;
        }
        // 显示或隐藏空状态
        async function checkJsonEmpty() {
        try {
            const emptyState = document.querySelector('.empty-state');
            console.log('找到空状态元素:', emptyState); // 检查是否找到元素

            const response = await fetch('/posts/posts.json');
            console.log('响应状态:', response.status); // 检查文件是否找到

            const data = await response.json();
            console.log('JSON 数据:', data); // 检查数据内容

            const isEmpty = Object.keys(data).length === 0 ||
                           (data.posts && data.posts.length === 0);
            console.log('是否为空:', isEmpty);

            emptyState.style.display = isEmpty ? 'block' : 'none';
        } catch (error) {
            console.error('错误:', error);
            document.querySelector('.empty-state').style.display = 'block';
        }
}

// 渲染列表
async function loadAndRenderPosts() {
    try {
        const response = await fetch('/posts/posts.json');
        const posts = await response.json();

        const postsContainer = document.getElementById('posts-container');

        if (posts && posts.length > 0) {
            // 排序文章
            const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // 隐藏空状态
            document.querySelector('.empty-state').style.display = 'none';

            // 渲染文章列表（这里要用 sortedPosts 而不是 posts）
            postsContainer.innerHTML = sortedPosts.map(post => `
                <div class="post-card">
                    <div class="post-header">
                        <h3 class="post-title">${post.title}</h3>
                        <div class="post-meta">
                            ${formatDate(post.createdAt)} · 
                            ${post.likes}点赞
                        </div>
                    </div>
                    <div class="post-content">
                        ${post.content}
                    </div>
                </div>
            `).join('');
        } else {
            // 显示空状态
            document.querySelector('.empty-state').style.display = 'block';
            postsContainer.innerHTML = '';
        }
    } catch (error) {
        console.error('加载文章失败:', error);
        document.querySelector('.empty-state').style.display = 'block';
    }
}

// 格式化日期函数
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return '今天';
    } else if (diffDays === 1) {
        return '昨天';
    } else if (diffDays < 7) {
        return `${diffDays}天前`;
    } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)}周前`;
    } else {
        return date.toLocaleDateString('zh-CN');
    }
}

// 页面加载时调用
document.addEventListener('DOMContentLoaded', loadAndRenderPosts);
checkJsonEmpty();

        // 初始化
        updateTime();
        updateGreeting();

        // 每秒更新时间
        setInterval(updateTime, 1000);

        // 每分钟更新问候
        setInterval(updateGreeting, 60000);

        // 添加天气图标动画
        const weatherIcons = ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️'];
        let currentIconIndex = 1;

        setInterval(() => {
            const weatherIcon = document.querySelector('.weather-icon');
            if (weatherIcon) {
                weatherIcon.style.opacity = '0.5';
                setTimeout(() => {
                    currentIconIndex = (currentIconIndex + 1) % weatherIcons.length;
                    weatherIcon.textContent = weatherIcons[currentIconIndex];
                    weatherIcon.style.opacity = '1';
                }, 300);
            }
        }, 10000);

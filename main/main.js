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
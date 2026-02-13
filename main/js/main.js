// ========== 赛博主脚本 ==========
// 对应: index.html - 全局功能

// 页面切换功能
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // 移除所有active类
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.cyber-page').forEach(page => page.classList.remove('active'));

        // 添加active类到当前项
        this.classList.add('active');

        // 显示对应页面
        const pageId = this.dataset.page + '-page';
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');

            // 触发页面进入音效（如果有）
            console.log(`页面切换: ${pageId}`);
        }
    });
});

// 实时更新时间
function updateCyberTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');

    if (!timeElement || !dateElement) return;

    // 格式化时间 - 24小时制
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // 格式化日期 - 赛博风格
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[now.getDay()];

    dateElement.textContent = `${year}.${month}.${day} ${weekday}`;
    timeElement.textContent = timeString;
}

// 动态问候语 - 神经接驳
function updateCyberGreeting() {
    const hour = new Date().getHours();
    const greetingElement = document.getElementById('dynamic-greeting');
    if (!greetingElement) return;

    let greeting = '';

    if (hour >= 5 && hour < 12) {
        greeting = '早晨好，神经漫游者';
    } else if (hour >= 12 && hour < 14) {
        greeting = '量子午休时间，接驳者';
    } else if (hour >= 14 && hour < 18) {
        greeting = '下午好，代码编织者';
    } else if (hour >= 18 && hour < 22) {
        greeting = '夜间模式已激活，守望者';
    } else {
        greeting = '深度睡眠协议，静默者';
    }

    greetingElement.textContent = greeting;
}

// 添加赛博故障效果
function addCyberGlitch() {
    const glitchElements = document.querySelectorAll('.glitch-title, .glitch-id, .glitch-data');

    setInterval(() => {
        glitchElements.forEach(el => {
            if (Math.random() > 0.7) {
                el.style.animation = 'none';
                el.offsetHeight; // 触发重绘
                el.style.animation = 'glitch 4s infinite';
            }
        });
    }, 5000);
}

// 添加水波纹效果到帖子卡片
function addRippleEffect() {
    const postCards = document.querySelectorAll('.cyber-post-card');

    postCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.8s ease-out;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 10;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 800);
        });
    });
}

// 添加样式到head
function addRippleKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            from { transform: scale(0); opacity: 0.8; }
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 模拟全息天气变化
let weatherIcons = ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️'];
let currentWeatherIndex = 1;

function initWeatherAnimation() {
    const weatherIcon = document.querySelector('.weather-icon');
    if (!weatherIcon) return;

    setInterval(() => {
        weatherIcon.style.opacity = '0.5';
        weatherIcon.style.transform = 'scale(0.9)';

        setTimeout(() => {
            currentWeatherIndex = (currentWeatherIndex + 1) % weatherIcons.length;
            weatherIcon.textContent = weatherIcons[currentWeatherIndex];
            weatherIcon.style.opacity = '1';
            weatherIcon.style.transform = 'scale(1)';
        }, 300);
    }, 8000);
}

// 初始化所有赛博效果
document.addEventListener('DOMContentLoaded', () => {
    updateCyberTime();
    updateCyberGreeting();
    addRippleKeyframes();
    addCyberGlitch();
    initWeatherAnimation();

    // 每秒更新时间
    setInterval(updateCyberTime, 1000);

    // 每分钟更新问候
    setInterval(updateCyberGreeting, 60000);
    
    // 延迟添加水波纹，确保帖子卡片已加载
    setTimeout(addRippleEffect, 500);

    console.log('赛博系统初始化完成 · 神经接驳成功');
});

function goTomusic() {
    window.location.href = "music.html";
}
function goTknowledge() {
    window.location.href = "knowledge.html";
}
fetch('/posts/music/music.json')
  .then(r=>r.json())
  .then(d=>document.getElementById('stat-value').innerHTML = d.at(-1)?.id||'')
fetch('/posts/knowledge/knowledge.json')
  .then(r=>r.json())
  .then(d=>document.getElementById('stat-value1').innerHTML = d.at(-1)?.id||'')
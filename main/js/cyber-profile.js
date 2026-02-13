// ========== 赛博·我的页面脚本 ==========
// 对应: index.html - profile-page, 动态效果

// 初始化赛博我的页面特效
function initCyberProfile() {
    const profilePage = document.querySelector('.profile-page');
    if (!profilePage) return;

    // 1. 故障文字随机触发
    setInterval(() => {
        const glitchText = document.querySelector('.glitch-id');
        if (glitchText && Math.random() > 0.7) {
            glitchText.style.animation = 'none';
            glitchText.offsetHeight;
            glitchText.style.animation = 'glitch 4s infinite';
        }

        const glitchData = document.querySelectorAll('.glitch-data');
        glitchData.forEach(el => {
            if (Math.random() > 0.8) {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = 'glitch 4s infinite';
            }
        });
    }, 5000);

    // 2. 模拟量子态波动
    const streamData = document.querySelectorAll('.stream-data');
    setInterval(() => {
        if (document.hidden) return;

        streamData.forEach(el => {
            // 随机微调数值
            if (el.textContent.includes('5') && Math.random() > 0.8) {
                const original = el.textContent;
                el.textContent = '6';
                el.style.color = '#ff44aa';
                setTimeout(() => {
                    el.textContent = original;
                    el.style.color = '';
                }, 300);
            }

            if (el.textContent.includes('87%') && Math.random() > 0.7) {
                el.textContent = '88%';
                setTimeout(() => { el.textContent = '87%'; }, 400);
            }

            if (el.textContent.includes('2048') && Math.random() > 0.8) {
                el.textContent = '2049GB';
                setTimeout(() => { el.textContent = '2048GB'; }, 400);
            }
        });
    }, 6000);

    // 3. 头像点击故障效应
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
        avatar.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            this.style.borderColor = '#ff44aa';
            this.style.boxShadow = '0 0 50px magenta';

            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }, 300);

            // 触发光环闪烁
            const ring = document.querySelector('.avatar-ring-primary');
            if (ring) {
                ring.style.boxShadow = '0 0 60px magenta, inset 0 0 40px magenta';
                ring.style.borderColor = '#ff44aa';
                setTimeout(() => {
                    ring.style.boxShadow = '';
                    ring.style.borderColor = '';
                }, 400);
            }
        });
    }

    // 4. 动态更新建站时间为运行时长
    updateSiteRuntime();
}

// 更新建站运行时长
function updateSiteRuntime() {
    const birthDate = new Date('2026-02-06 00:01:56');

    setInterval(() => {
        const now = new Date();
        const diff = now - birthDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // 查找建站时间元素
        const streamItems = document.querySelectorAll('.stream-item');
        streamItems.forEach(item => {
            if (item.textContent.includes('建站')) {
                const dataSpan = item.querySelector('.stream-data');
                if (dataSpan) {
                    dataSpan.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                }
            }
        });
    }, 1000);
}

// 导出初始化函数
export { initCyberProfile };

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 确保只在profile页面有该元素时执行
    if (document.querySelector('.profile-page')) {
        initCyberProfile();
    }
});
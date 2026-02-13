// ========== 赛博帖子脚本 ==========
// 对应: index.html - posts-page, 文章加载与渲染

// HTML 转义函数
function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 从MD文件内容中提取图片链接
function extractImagesFromMarkdown(content) {
    if (!content) return [];
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const matches = [...content.matchAll(imageRegex)];
    return matches.map(match => match[1]);
}

// 从MD文件中提取纯文本内容
function extractTextFromMarkdown(content) {
    if (!content) return '';
    let text = content.replace(/!\[.*?\]\(.*?\)/g, '');
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`[^`]*`/g, '');
    text = text.replace(/[#*_\-\[\]()>|`~]/g, '');
    text = text.replace(/\n\s*\n/g, '\n').trim();
    return text;
}

// 加载单个文章内容
async function loadPostContent(postId) {
    try {
        const response = await fetch(`../posts/content/${postId}.md`);
        if (response.ok) {
            return await response.text();
        }
        return null;
    } catch (error) {
        console.error(`神经信号丢失: 文章 ${postId}`, error);
        return null;
    }
}

// 格式化日期 - 赛博风格
function formatCyberDate(dateString) {
    if (!dateString) return '未知时间';

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return '今日';
        } else if (diffDays === 1) {
            return '昨日';
        } else if (diffDays === 2) {
            return '前日';
        } else {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        }
    } catch (e) {
        return dateString;
    }
}

// 检查JSON是否为空
async function checkJsonEmpty() {
    try {
        const emptyState = document.querySelector('.cyber-empty-state');
        if (!emptyState) return;

        const response = await fetch('../posts/posts.json');
        const data = await response.json();
        const isEmpty = Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0;

        emptyState.style.display = isEmpty ? 'block' : 'none';
    } catch (error) {
        console.error('检查神经信号失败:', error);
        const emptyState = document.querySelector('.cyber-empty-state');
        if (emptyState) emptyState.style.display = 'block';
    }
}

// 渲染文章列表
async function loadAndRenderPosts() {
    try {
        const response = await fetch('../posts/posts.json');
        const posts = await response.json();
        const postsContainer = document.getElementById('posts-container');

        if (!postsContainer) return;

        if (posts && Array.isArray(posts) && posts.length > 0) {
            // 排序文章
            const sortedPosts = [...posts].sort((a, b) => {
                try {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                } catch (e) {
                    return 0;
                }
            });

            // 隐藏空状态
            const emptyState = document.querySelector('.cyber-empty-state');
            if (emptyState) emptyState.style.display = 'none';

            // 批量加载文章内容
            const postsWithContent = await Promise.all(
                sortedPosts.map(async (post) => {
                    try {
                        const content = await loadPostContent(post.id);
                        if (content) {
                            const images = extractImagesFromMarkdown(content).slice(0, 2);
                            const textContent = extractTextFromMarkdown(content);

                            return {
                                ...post,
                                content: content,
                                images: images,
                                textContent: textContent
                            };
                        }
                    } catch (error) {
                        console.error(`处理神经脉冲 ${post.id} 失败:`, error);
                    }

                    return {
                        ...post,
                        content: '',
                        images: [],
                        textContent: post.content || ''
                    };
                })
            );

            // 渲染文章
            postsContainer.innerHTML = postsWithContent.map(post => {
                let displayContent = post.textContent || post.content || '';
                displayContent = displayContent.length > 180
                    ? displayContent.substring(0, 180) + '...'
                    : displayContent;

                return `
                <div class="cyber-post-card" data-post-id="${escapeHtml(post.id)}" onclick="goToPostDetail('${escapeHtml(post.id)}')">
                    <div class="post-card-header">
                        <h3 class="post-card-title">${escapeHtml(post.title || '未命名神经信号')}</h3>
                        <div class="post-card-meta">
                            <span class="post-card-time">⏱ ${formatCyberDate(post.createdAt)}</span>
                            ${post.likes ? `<span class="post-card-likes">❤️ ${post.likes}</span>` : ''}
                            ${post.views ? `<span class="post-card-views">👁️ ${post.views}</span>` : ''}
                        </div>
                    </div>
                    ${displayContent ? `
                    <div class="post-card-content">
                        ${escapeHtml(displayContent)}
                    </div>
                    ` : ''}
                    ${post.images && post.images.length > 0 ? `
                    <div class="post-card-images ${post.images.length === 1 ? 'single-image' : ''}">
                        ${post.images.map(img => `
                            <div class="post-card-image" style="background-image: url(${escapeHtml(img)})">
                                <div class="image-overlay"></div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                `;
            }).join('');

            // 重新添加水波纹效果
            if (window.addRippleEffect) {
                setTimeout(window.addRippleEffect, 100);
            }

        } else {
            const emptyState = document.querySelector('.cyber-empty-state');
            if (emptyState) emptyState.style.display = 'block';
            postsContainer.innerHTML = '';
        }
    } catch (error) {
        console.error('加载神经信号失败:', error);
        const emptyState = document.querySelector('.cyber-empty-state');
        if (emptyState) emptyState.style.display = 'block';
    }
}

// 跳转到文章详情
function goToPostDetail(postId) {
    window.location.href = "posts.html?id=" + encodeURIComponent(postId);
}

// 导出到全局
window.goToPostDetail = goToPostDetail;
window.loadAndRenderPosts = loadAndRenderPosts;
window.checkJsonEmpty = checkJsonEmpty;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadAndRenderPosts();
    checkJsonEmpty();
});
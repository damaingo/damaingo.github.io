// 在main.js中
/// <reference path="./utils.js" 
// 使用浏览器本地存储来保存文章数据
const storageKey = 'myBlogPosts';

// 创建 Vue 应用
const { createApp } = Vue;

createApp({
    data() {
        return {
            showEditor: false,
            editingPost: null,
            currentPost: {
                title: '',
                content: ''
            },
            posts: []
        }
    },
    
    computed: {
        // 按创建时间倒序排列文章
        sortedPosts() {
            return [...this.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    },
    
    mounted() {
        this.loadPosts();
    },
    
    methods: {
        // 加载文章
        loadPosts() {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                this.posts = JSON.parse(saved);
            }
        },
        
        // 保存文章到本地存储
        savePosts() {
             // 准备数据
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            totalPosts: this.posts.length,
            posts: this.posts
        };

        // 转换为JSON字符串
        const jsonString = JSON.stringify(data, null, 2);

        // 创建Blob对象
        const blob = new Blob([jsonString], { type: 'application/json' });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'posts.json';

        // 触发下载
        document.body.appendChild(a);
        a.click();

        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('帖子已保存到 posts.json 文件');
        },
        
        // 打开编辑器（新建或编辑）
        openEditor(post = null) {
            this.editingPost = post;
            if (post) {
                this.currentPost = {
                    title: post.title,
                    content: post.content
                };
            } else {
                this.currentPost = {
                    title: '',
                    content: ''
                };
            }
            this.showEditor = true;
        },
        
        // 关闭编辑器
        closeEditor() {
            this.showEditor = false;
            this.editingPost = null;
            this.currentPost = {
                title: '',
                content: ''
            };
        },
        
        // 保存文章
        savePost() {
            if (!this.currentPost.title.trim() || !this.currentPost.content.trim()) {
                alert('请填写标题和内容！');
                return;
            }
            
            if (this.editingPost) {
                // 更新现有文章
                const index = this.posts.findIndex(p => p.id === this.editingPost.id);
                if (index !== -1) {
                    this.posts[index].title = this.currentPost.title;
                    this.posts[index].content = this.currentPost.content;
                    this.posts[index].updatedAt = new Date().toISOString();
                }
            } else {
                // 创建新文章
                const newPost = {
                    id: Date.now().toString(),
                    title: this.currentPost.title,
                    content: this.currentPost.content,
                    likes: 0,
                    hasLiked: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                this.posts.push(newPost);
            }
            
            this.savePosts();
            this.closeEditor();
        },
        
        // 编辑文章
        editPost(post) {
            this.openEditor(post);
        },
        
        // 删除文章
        deletePost(postId) {
            if (confirm('确定要删除这篇文章吗？')) {
                this.posts = this.posts.filter(post => post.id !== postId);
                this.savePosts();
            }
        },
        
        // 点赞/取消点赞
        toggleLike(post) {
            if (post.hasLiked) {
                post.likes--;
                post.hasLiked = false;
            } else {
                post.likes++;
                post.hasLiked = true;
            }
            this.savePosts();
        },
        
        // 格式化日期
        formatDate(dateString) {
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
            } else {
                return date.toLocaleDateString('zh-CN');
            }
        }
    }
}).mount('#app');
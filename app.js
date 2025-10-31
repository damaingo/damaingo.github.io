const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 你的 posts.json 文件路径
const POSTS_FILE = 'D:/Daqian/GitHub/damaingo.github.io.web/posts.json';

async function uploadToGitHub(commitMessage = '更新博客文章') {
    try {
        console.log('🚀 开始通过 SSH 上传到 GitHub...');
        console.log('✅ SSH 认证已确认正常\n');

        // 确保在正确的目录工作
        const workspaceDir = path.dirname(POSTS_FILE);
        console.log(`📁 工作目录: ${workspaceDir}`);

        // 1. 检查是否是 Git 仓库
        try {
            await runCommand('git status', workspaceDir);
            console.log('✅ Git 仓库已初始化');
        } catch (error) {
            console.log('📁 初始化 Git 仓库...');
            await runCommand('git init', workspaceDir);
        }

        // 2. 设置 SSH 远程仓库
        try {
            const remoteUrl = await runCommand('git remote get-url origin', workspaceDir);
            console.log(`📡 当前远程仓库: ${remoteUrl.trim()}`);

            if (!remoteUrl.includes('git@github.com')) {
                console.log('🔄 更新为 SSH 远程仓库...');
                await runCommand('git remote set-url origin git@github.com:damaingo/damaingo.github.io.git', workspaceDir);
            }
        } catch (error) {
            console.log('📡 添加 SSH 远程仓库...');
            await runCommand('git remote add origin git@github.com:damaingo/damaingo.github.io.git', workspaceDir);
        }

        // 3. 配置 Git 用户信息（如果尚未配置）
        try {
            await runCommand('git config user.name', workspaceDir);
        } catch (error) {
            console.log('👤 设置 Git 用户名称...');
            await runCommand('git config user.name "damaingo"', workspaceDir);
        }

        try {
            await runCommand('git config user.email', workspaceDir);
        } catch (error) {
            console.log('📧 设置 Git 用户邮箱...');
            await runCommand('git config user.email "你的邮箱@example.com"', workspaceDir);
        }

        // 4. 拉取最新代码
        console.log('📥 拉取最新代码...');
        try {
            await runCommand('git pull origin main --allow-unrelated-histories', workspaceDir);
            console.log('✅ 代码拉取成功');
        } catch (pullError) {
            console.log('⚠️ 拉取时出现问题，尝试解决...');
            // 先提交本地更改
            try {
                await runCommand('git add .', workspaceDir);
                await runCommand('git commit -m "临时提交: 合并前保存更改"', workspaceDir);
            } catch (commitError) {
                // 忽略提交错误（可能没有更改）
            }
            // 再次尝试拉取
            await runCommand('git pull origin main --allow-unrelated-histories --no-edit', workspaceDir);
        }

        // 5. 确保 posts 目录存在
        const postsDir = path.join(workspaceDir, 'posts');
        if (!fs.existsSync(postsDir)) {
            fs.mkdirSync(postsDir, { recursive: true });
            console.log('✅ 创建 posts 目录');
        }

        // 6. 复制文件
        if (!fs.existsSync(POSTS_FILE)) {
            throw new Error(`❌ 源文件不存在: ${POSTS_FILE}`);
        }

        const targetPath = path.join(postsDir, 'posts.json');
        fs.copyFileSync(POSTS_FILE, targetPath);
        console.log(`✅ 文件已复制: ${targetPath}`);

        // 7. 添加文件到 Git
        await runCommand('git add .', workspaceDir);
        console.log('✅ 文件已添加到暂存区');

        // 8. 检查是否有更改
        const status = await runCommand('git status --porcelain', workspaceDir);
        if (!status.trim()) {
            console.log('ℹ️ 没有检测到更改，无需提交');
            return true;
        }

        // 9. 提交更改
        await runCommand(`git commit -m "${commitMessage}"`, workspaceDir);
        console.log('✅ 更改已提交');

        // 10. 推送到 GitHub
        console.log('📤 推送代码到 GitHub...');
        await runCommand('git push -u origin main', workspaceDir);
        console.log('✅ 代码推送成功!');

        console.log('\n🎉 上传完成!');
        console.log('🌐 访问地址: https://damaingo.github.io/posts/posts.json');

        return true;

    } catch (error) {
        console.error('❌ 上传失败:', error.message);

        // 提供具体的错误解决方案
        if (error.message.includes('failed to push some refs')) {
            console.log('\n💡 解决方案: 远程有新的提交，请先拉取');
            console.log('git pull origin main');
            console.log('然后再次运行此脚本');
        } else if (error.message.includes('not a git repository')) {
            console.log('\n💡 解决方案: 目录不是 Git 仓库');
            console.log('请确保在正确的目录运行脚本');
        }

        return false;
    }
}

function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`  执行: ${command}`);
        exec(command, { cwd: cwd }, (error, stdout, stderr) => {
            if (error) {
                // 忽略一些可以继续的错误
                if (error.message.includes('nothing to commit')) {
                    resolve('没有更改需要提交');
                } else if (error.message.includes('already up-to-date')) {
                    resolve('已经是最新版本');
                } else if (error.message.includes('Your branch is up to date')) {
                    resolve('分支已更新');
                } else {
                    reject(error);
                }
            } else {
                if (stdout && stdout.trim()) console.log(`  输出: ${stdout.trim()}`);
                resolve(stdout);
            }
        });
    });
}

// 运行上传
console.log('=' .repeat(50));
uploadToGitHub('自动更新博客文章数据').then(success => {
    console.log('=' .repeat(50));
    if (!success) {
        console.log('\n💡 手动操作命令:');
        console.log('cd D:/Daqian/GitHub/damaingo.github.io.web');
        console.log('git add .');
        console.log('git commit -m "更新博客文章"');
        console.log('git pull origin main');
        console.log('git push origin main');
    }
});
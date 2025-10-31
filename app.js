const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const POSTS_FILE = 'D:/Daqian/GitHub/damaingo.github.io.web/posts.json';

async function uploadToGitHub(commitMessage = '更新博客文章') {
    try {
        console.log('🚀 开始通过 SSH 上传到 GitHub...');
        const workspaceDir = path.dirname(POSTS_FILE);

        // 1. 检查当前分支
        console.log('🌿 检查分支状态...');
        let currentBranch;
        try {
            currentBranch = await runCommand('git branch --show-current', workspaceDir);
            console.log(`✅ 当前分支: ${currentBranch.trim()}`);
        } catch (error) {
            console.log('❌ 无法获取当前分支，可能还没有提交');
        }

        // 2. 检查所有分支
        const branches = await runCommand('git branch -a', workspaceDir);
        console.log('可用分支:');
        console.log(branches);

        // 3. 设置远程仓库
        try {
            await runCommand('git remote get-url origin', workspaceDir);
        } catch (error) {
            await runCommand('git remote add origin git@github.com:damaingo/damaingo.github.io.git', workspaceDir);
        }

        // 4. 拉取远程分支信息
        console.log('📥 获取远程分支信息...');
        await runCommand('git fetch origin', workspaceDir);

        // 5. 检查远程是否有 main 分支
        try {
            await runCommand('git ls-remote --heads origin main', workspaceDir);
            console.log('✅ 远程存在 main 分支');

            // 如果本地没有 main 分支，创建并切换
            try {
                await runCommand('git rev-parse --verify main', workspaceDir);
            } catch (error) {
                console.log('🔄 创建并切换到 main 分支...');
                await runCommand('git checkout -b main', workspaceDir);
            }
        } catch (error) {
            console.log('❌ 远程没有 main 分支，使用 master 分支');
            // 使用 master 分支
            await runCommand('git checkout master', workspaceDir);
        }

        // 6. 复制文件
        const postsDir = path.join(workspaceDir, 'posts');
        if (!fs.existsSync(postsDir)) {
            fs.mkdirSync(postsDir, { recursive: true });
        }

        if (fs.existsSync(POSTS_FILE)) {
            fs.copyFileSync(POSTS_FILE, path.join(postsDir, 'posts.json'));
            console.log('✅ 文件已准备');
        }

        // 7. 提交更改
        await runCommand('git add .', workspaceDir);

        // 检查是否有更改需要提交
        const status = await runCommand('git status --porcelain', workspaceDir);
        if (status.trim()) {
            await runCommand(`git commit -m "${commitMessage}"`, workspaceDir);
            console.log('✅ 更改已提交');
        } else {
            console.log('ℹ️ 没有更改需要提交');
        }

        // 8. 推送到远程（自动检测分支）
        const currentBranchName = await runCommand('git branch --show-current', workspaceDir);
        const branch = currentBranchName.trim();

        console.log(`📤 推送分支 ${branch} 到远程...`);
        await runCommand(`git push -u origin ${branch}`, workspaceDir);

        console.log('🎉 上传完成!');
        return true;

    } catch (error) {
        console.error('❌ 上传失败:', error.message);
        return false;
    }
}

function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`  执行: ${command}`);
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error && !error.message.includes('nothing to commit') &&
                !error.message.includes('already up-to-date')) {
                reject(error);
            } else {
                if (stdout) console.log(`  输出: ${stdout.trim()}`);
                resolve(stdout || stderr);
            }
        });
    });
}

uploadToGitHub().then(success => {
    if (success) {
        console.log('🌐 访问: https://damaingo.github.io/posts/posts.json');
    }
});
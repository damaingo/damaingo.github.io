const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 你的 posts.json 文件路径
const POSTS_FILE = 'D:/Daqian/GitHub/damaingo.github.io.web/posts.json';

async function uploadToGitHub(commitMessage = '更新博客文章') {
    try {
        console.log('🚀 开始上传到 GitHub...');

        // 1. 检查是否是 Git 仓库，如果不是则初始化
        try {
            await runCommand('git status');
        } catch (error) {
            console.log('📁 初始化 Git 仓库...');
            await runCommand('git init');
        }

        // 2. 检查远程仓库是否存在，如果存在则更新 URL
        let remoteExists = false;
        try {
            await runCommand('git remote get-url origin');
            remoteExists = true;
            console.log('✅ 远程仓库已存在，更新 URL...');
            await runCommand('git remote set-url origin https://github.com/damaingo/damaingo.github.io.git');
        } catch (error) {
            console.log('📡 添加远程仓库...');
            await runCommand('git remote add origin https://github.com/damaingo/damaingo.github.io.git');
        }

        // 3. 拉取最新代码（处理可能的冲突）
        console.log('📥 拉取最新代码...');
        try {
            await runCommand('git pull origin main --allow-unrelated-histories');
        } catch (pullError) {
            console.log('⚠️ 拉取时出现冲突，尝试解决...');
            // 如果拉取失败，尝试先提交本地更改
            await runCommand('git add .');
            try {
                await runCommand('git commit -m "临时提交本地更改"');
            } catch (commitError) {
                // 如果提交失败，可能是没有更改，继续
            }
            await runCommand('git pull origin main --allow-unrelated-histories --no-edit');
        }

        // 4. 确保目标目录存在
        const targetDir = './posts';
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // 5. 检查源文件是否存在
        if (!fs.existsSync(POSTS_FILE)) {
            throw new Error(`源文件不存在: ${POSTS_FILE}`);
        }

        // 6. 复制文件到目标目录
        const targetPath = path.join(targetDir, 'posts.json');
        fs.copyFileSync(POSTS_FILE, targetPath);
        console.log('✅ 文件已准备:', targetPath);

        // 7. Git 添加文件
        await runCommand('git add .');
        console.log('✅ 文件已添加到 Git');

        // 8. 检查是否有更改需要提交
        const status = await runCommand('git status --porcelain');
        if (!status.trim()) {
            console.log('ℹ️ 没有更改需要提交');
            return true;
        }

        // 9. Git 提交
        await runCommand(`git commit -m "${commitMessage}"`);
        console.log('✅ 提交完成');

        // 10. Git 推送
        await runCommand('git push origin main');
        console.log('✅ 已推送到 GitHub!');

        console.log('🌐 访问: https://damaingo.github.io/posts/posts.json');
        return true;

    } catch (error) {
        console.error('❌ 上传失败:', error.message);

        // 提供更详细的错误信息
        if (error.message.includes('non-fast-forward')) {
            console.log('💡 提示: 远程有新的提交，请先拉取并合并更改');
        } else if (error.message.includes('remote origin already exists')) {
            console.log('💡 提示: 远程仓库已存在，已自动处理');
        }

        return false;
    }
}

function runCommand(command) {
    return new Promise((resolve, reject) => {
        console.log(`📝 执行: ${command}`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                // 有些错误可以忽略，比如没有更改可提交
                if (error.message.includes('nothing to commit')) {
                    resolve('没有更改需要提交');
                } else {
                    reject(error);
                }
            } else {
                if (stdout) console.log(stdout);
                if (stderr) console.log('⚠️:', stderr);
                resolve(stdout);
            }
        });
    });
}

// 运行上传
uploadToGitHub().then(success => {
    if (success) {
        console.log('🎉 上传完成!');
    } else {
        console.log('💥 上传失败!');
        console.log('\n💡 建议手动执行以下命令:');
        console.log('git pull origin main');
        console.log('git add .');
        console.log('git commit -m "更新博客文章"');
        console.log('git push origin main');
    }
});
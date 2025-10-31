const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 你的 posts.json 文件路径
const POSTS_FILE = 'D:/Daqian/GitHub/damaingo.github.io.web/posts.json';

async function uploadToGitHub(commitMessage = '更新博客文章') {
    try {
        console.log('🚀 开始通过 SSH 上传到 GitHub...');

        // 1. 检查是否是 Git 仓库
        try {
            await runCommand('git status');
        } catch (error) {
            console.log('📁 初始化 Git 仓库...');
            await runCommand('git init');
        }

        // 2. 设置 SSH 远程仓库
        let remoteExists = false;
        try {
            await runCommand('git remote get-url origin');
            remoteExists = true;
            console.log('✅ 远程仓库已存在，更新为 SSH URL...');
            await runCommand('git remote set-url origin git@github.com:damaingo/damaingo.github.io.git');
        } catch (error) {
            console.log('📡 添加 SSH 远程仓库...');
            await runCommand('git remote add origin git@github.com:damaingo/damaingo.github.io.git');
        }

        // 3. 测试 SSH 连接
        console.log('🔑 测试 SSH 连接...');
        try {
            await runCommand('ssh -T git@github.com');
            console.log('✅ SSH 连接正常');
        } catch (sshError) {
            console.log('⚠️ SSH 连接测试失败，但继续尝试...');
        }

        // 4. 拉取最新代码
        console.log('📥 拉取最新代码...');
        try {
            await runCommand('git pull origin main --allow-unrelated-histories');
        } catch (pullError) {
            console.log('⚠️ 拉取时出现冲突，尝试解决...');
            await runCommand('git add .');
            try {
                await runCommand('git commit -m "临时提交本地更改"');
            } catch (commitError) {
                // 忽略提交错误
            }
            await runCommand('git pull origin main --allow-unrelated-histories --no-edit');
        }

        // 5. 确保目标目录存在
        const targetDir = './posts';
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // 6. 检查源文件是否存在
        if (!fs.existsSync(POSTS_FILE)) {
            throw new Error(`源文件不存在: ${POSTS_FILE}`);
        }

        // 7. 复制文件到目标目录
        const targetPath = path.join(targetDir, 'posts.json');
        fs.copyFileSync(POSTS_FILE, targetPath);
        console.log('✅ 文件已准备:', targetPath);

        // 8. Git 添加文件
        await runCommand('git add .');
        console.log('✅ 文件已添加到 Git');

        // 9. 检查是否有更改需要提交
        const status = await runCommand('git status --porcelain');
        if (!status.trim()) {
            console.log('ℹ️ 没有更改需要提交');
            return true;
        }

        // 10. Git 提交
        await runCommand(`git commit -m "${commitMessage}"`);
        console.log('✅ 提交完成');

        // 11. Git 推送（使用 SSH）
        await runCommand('git push -u origin main');
        console.log('✅ 已通过 SSH 推送到 GitHub!');

        console.log('🌐 访问: https://damaingo.github.io/posts/posts.json');
        return true;

    } catch (error) {
        console.error('❌ SSH 上传失败:', error.message);

        if (error.message.includes('Permission denied')) {
            console.log('\n🔑 SSH 密钥问题解决方案:');
            console.log('1. 检查 SSH 密钥是否已添加到 GitHub');
            console.log('2. 运行: ssh -T git@github.com 测试连接');
            console.log('3. 确保 ~/.ssh/id_rsa.pub 内容已添加到 GitHub SSH Keys');
        } else if (error.message.includes('Could not resolve hostname')) {
            console.log('\n🌐 网络问题:');
            console.log('1. 检查网络连接');
            console.log('2. 尝试使用 HTTPS 方式');
        }

        return false;
    }
}

function runCommand(command) {
    return new Promise((resolve, reject) => {
        console.log(`📝 执行: ${command}`);
        exec(command, { cwd: path.dirname(POSTS_FILE) }, (error, stdout, stderr) => {
            if (error) {
                // 忽略一些可以继续的错误
                if (error.message.includes('nothing to commit')) {
                    resolve('没有更改需要提交');
                } else if (error.message.includes('already up to date')) {
                    resolve('已经是最新版本');
                } else {
                    reject(error);
                }
            } else {
                if (stdout) console.log(stdout);
                if (stderr && !stderr.includes('Warning: Permanently added')) {
                    console.log('⚠️:', stderr);
                }
                resolve(stdout);
            }
        });
    });
}

// 运行上传
uploadToGitHub().then(success => {
    if (success) {
        console.log('🎉 SSH 上传完成!');
    } else {
        console.log('💥 SSH 上传失败!');
        console.log('\n💡 手动 SSH 操作步骤:');
        console.log('cd D:/Daqian/GitHub/damaingo.github.io.web');
        console.log('git add .');
        console.log('git commit -m "更新博客文章"');
        console.log('git pull origin main');
        console.log('git push origin main');
    }
});
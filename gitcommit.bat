@echo off
:: 解决终端中文乱码
chcp 65001 >nul

:: 灵魂指令：强制锚定当前 .bat 文件所在的真实物理目录！
cd /d "%~dp0"

echo ==========================================
echo   🚀 正在构建并推送到 GitHub...
echo ==========================================

git init
git add .
git commit -m "🚀 Initial commit: Vibe Coder Architecture"
git branch -M main

:: 【注意】：请把下面这行的 URL 换成你刚才建好的真实仓库地址
git remote add origin https://github.com/nvglitch/parallax-portfolio.git

git push -u origin main

echo ==========================================
echo   ✅ 推送完成！请去 GitHub 检查 Action 状态。
echo ==========================================
pause
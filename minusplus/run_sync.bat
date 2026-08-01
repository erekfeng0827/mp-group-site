@echo off
chcp 65001 >nul
echo ==========================================
echo   加減設計作品集同步腳本
echo   執行時間: %date% %time%
echo ==========================================
echo.

set "PORTFOLIO=D:\COWORK\1.素材\WEB\mp-group\Minusplus\assets\portfolio"

REM ======== 步驟 1: 複製 new/ 圖片到主目錄 ========
echo [1/3] 同步 new/ 資料夾圖片到主目錄...
powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "%~dp0sync_new_images.ps1"
echo.

REM ======== 步驟 2: 更新 portfolio-data.js ========
echo [2/3] 更新 portfolio-data.js...
powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "& {"
powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue';"
powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "$js=Get-Content '%PORTFOLIO%\..\portfolio-data.js' -Raw -Encoding UTF8;"
echo   請手動修改 portfolio-data.js：
echo   - 4 個私人案子加上 isPrivate: true
echo   - 其餘案子 images[] 改為 new/ 資料夾的圖片
pause
exit /b 1

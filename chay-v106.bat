@echo off
rem Chay WS Editor BAN CU v106 (ws-editor-prototype.html) de so sanh.
rem Dat file nay o dau cung duoc. Neu nam trong thu muc da clone thi cap nhat ngay tai do,
rem neu khong thi tu tai ve thu muc WS-Editor canh file nay.
chcp 65001 >nul
setlocal
set "REPO=https://github.com/khanhtoaninv/WS-Editor.git"
set "HERE=%~dp0"

where git >nul 2>nul
if errorlevel 1 goto nogit

if exist "%HERE%.git" (
  set "DIR=%HERE%"
) else (
  set "DIR=%HERE%WS-Editor\"
)

if exist "%DIR%.git" goto update

echo Dang tai WS Editor ve %DIR% ...
git clone "%REPO%" "%DIR%"
if errorlevel 1 goto clonefail
goto open

:update
echo Dang cap nhat ban moi nhat ...
git -C "%DIR%" pull --ff-only
if errorlevel 1 (
  echo.
  echo Khong cap nhat duoc: co the mat mang, hoac file trong thu muc da bi sua tay.
  echo Van mo ban dang co.
  echo.
  timeout /t 4 >nul
)
goto open

:open
rem Luon mo ban cu v106 (de so sanh khi dang chuyen sang React).
if not exist "%DIR%ws-editor-prototype.html" goto nofile
start "" "%DIR%ws-editor-prototype.html"
exit /b 0

:nogit
echo Chua cai Git. Tai o https://git-scm.com/download/win roi chay lai file nay.
pause
exit /b 1

:clonefail
echo Khong tai duoc tu %REPO%
echo Kiem tra mang. Neu repo la private, dang nhap GitHub khi cua so yeu cau.
pause
exit /b 1

:nofile
echo Khong thay ws-editor-prototype.html trong %DIR%
pause
exit /b 1

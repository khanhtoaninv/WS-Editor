@echo off
rem Bam dup de day hoc co hoc sinh (Windows): cap nhat ban moi, bat may chu Lop hoc thu, mo WS Editor. Can Node.js 22.6+.
rem Trong WS Editor bam nut Live de giao phieu cho lop. Mat khau giao vien in ngay trong cua so nay.
chcp 65001 >nul
cd /d "%~dp0"
where git >nul 2>nul
if not errorlevel 1 if exist ".git" (
  echo Dang cap nhat ban moi nhat ...
  git pull --ff-only || echo Khong cap nhat duoc, van chay ban dang co.
)
start "" cmd /c "timeout /t 3 >nul & start http://localhost:1531/editor"
npm run lop
pause

@echo off
title Menjalankan Digital Love Gift Website
echo ===================================================
echo   Sedang Menjalankan Digital Love Gift Website...
echo ===================================================
echo.

set "PATH=D:\nodejs\node-v22.16.0-win-x64;%PATH%"

cd /d "%~dp0"

if not exist "node_modules" (
    echo Folder node_modules belum ada, menginstall dependency dulu...
    echo Ini hanya perlu dilakukan sekali dan butuh koneksi internet.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo Install gagal. Cek koneksi internet lalu coba jalankan run.bat lagi.
        pause
        exit /b
    )
    echo.
    echo Install selesai!
    echo.
)

echo Server siap di http://localhost:3000
echo Tekan Ctrl+C jika ingin menghentikan server.
echo.

start http://localhost:3000
call npm run dev
pause

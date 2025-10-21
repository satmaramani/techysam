@echo off
echo ========================================
echo IMAGE OPTIMIZATION SCRIPT
echo Sampurna Atmaramani Portfolio
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo Python found! Starting optimization...
echo.

REM Run the optimization script
python optimize_images.py

echo.
echo ========================================
echo Press any key to exit...
pause >nul


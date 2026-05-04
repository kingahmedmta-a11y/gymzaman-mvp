@echo off
echo Fixing Gym Zaman trainer overview...
powershell -ExecutionPolicy Bypass -File "%~dp0fix_trainer_overview.ps1"
pause

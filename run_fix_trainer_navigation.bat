@echo off
echo Fixing Gym Zaman trainer navigation...
powershell -ExecutionPolicy Bypass -File "%~dp0fix_trainer_navigation.ps1"
pause

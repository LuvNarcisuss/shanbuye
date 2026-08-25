@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Packaging Inspection Platform - Start

if /I "%~1"=="/nobrowser" (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-platform.ps1" -NoBrowser
) else (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-platform.ps1"
)

set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" pause
exit /b %EXIT_CODE%

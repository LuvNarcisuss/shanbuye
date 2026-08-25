@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Packaging Inspection Platform - Stop

if /I "%~1"=="/silent" (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-platform.ps1" -Silent
) else (
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-platform.ps1"
)

set "EXIT_CODE=%ERRORLEVEL%"
if /I not "%~1"=="/silent" pause
exit /b %EXIT_CODE%

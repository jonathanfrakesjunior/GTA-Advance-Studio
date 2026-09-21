@echo off
title GTA Advance Studio
cd /d "%~dp0"
echo.
echo   GTA Advance Studio wird geoeffnet ...
echo.
start "" "%~dp0index.html"
echo   Falls sich nichts oeffnet: index.html einfach doppelklicken
echo   oder per Rechtsklick mit Chrome / Edge / Firefox oeffnen.
echo.
timeout /t 4 >nul

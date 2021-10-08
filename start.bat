@echo off

start "Lavalink" cmd /k java -jar lavalink.jar

timeout /t 10 /nobreak

start "Northern" cmd /k node .
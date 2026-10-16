@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is missing. Install the LTS version from https://nodejs.org & pause & exit /b 1)
for /f "delims=" %%v in ('node -v') do echo Node %%v (needs v22.18 or newer)
if not exist node_modules call npm install
if not exist .env (
  echo APP_PASSWORD=password> .env
  node -e "console.log('APP_SECRET=' + require('crypto').randomBytes(32).toString('hex'))">> .env
)
start "" cmd /c "timeout /t 2 >nul & start http://localhost:4747"
node --env-file=.env src/main.ts
pause

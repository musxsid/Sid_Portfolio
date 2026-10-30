@echo off
echo Starting Sid's Portfolio Development Environment...

echo Starting Spring Boot Backend...
start "Backend" cmd /c "cd backend && .\mvnw spring-boot:run"

echo Starting Frontend...
start "Frontend" cmd /c "cd frontend && npm run dev"

echo Starting Admin Panel...
start "Admin" cmd /c "cd admin && npm run dev"

echo Starting Keycloak...
:: REPLACE THE PATH BELOW WITH YOUR ACTUAL KEYCLOAK FOLDER PATH
set KEYCLOAK_DIR=C:\path\to\your\keycloak
start "Keycloak" cmd /c "cd /d "%KEYCLOAK_DIR%\bin" && kc.bat start-dev"

echo All services started! You can close this window.
pause

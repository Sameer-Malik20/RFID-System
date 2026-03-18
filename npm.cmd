@echo off
setlocal
set "NPM_CMD=%ProgramFiles%\nodejs\npm.cmd"
if not exist "%NPM_CMD%" (
  set "NPM_CMD=%ProgramW6432%\nodejs\npm.cmd"
)
if not exist "%NPM_CMD%" (
  echo npm runtime not found. Install Node.js or update npm.cmd.
  exit /b 1
)
call "%NPM_CMD%" %*
exit /b %ERRORLEVEL%

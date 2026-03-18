@echo off
setlocal
set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not exist "%NODE_EXE%" (
  set "NODE_EXE=%ProgramW6432%\nodejs\node.exe"
)
if not exist "%NODE_EXE%" (
  echo Node.js runtime not found. Install Node.js or update click\node.cmd.
  exit /b 1
)
"%NODE_EXE%" %*
exit /b %ERRORLEVEL%

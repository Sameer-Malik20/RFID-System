import { clearServerPid, getRunningServerPid, getPidFilePath } from "./utils/processManager.js";

const pid = getRunningServerPid();

if (!pid) {
  console.log(`RFID System API is not running. No PID found in ${getPidFilePath()}.`);
  process.exit(0);
}

try {
  process.kill(pid, "SIGTERM");
  clearServerPid();
  console.log(`Stopped RFID System API (PID ${pid}).`);
} catch (error) {
  console.error(`Failed to stop RFID System API (PID ${pid}): ${error.message}`);
  process.exitCode = 1;
}

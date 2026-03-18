import { getPidFilePath, getRunningServerPid } from "./utils/processManager.js";

const pid = getRunningServerPid();

if (!pid) {
  console.log(`RFID System API is stopped. No active PID in ${getPidFilePath()}.`);
  process.exit(0);
}

console.log(`RFID System API is running with PID ${pid}.`);

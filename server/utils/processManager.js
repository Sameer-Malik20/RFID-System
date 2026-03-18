import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const pidFile = resolve(process.cwd(), ".server.pid");

function readPidFile() {
  if (!existsSync(pidFile)) {
    return null;
  }

  const rawValue = readFileSync(pidFile, "utf8").trim();
  const pid = Number(rawValue);
  return Number.isInteger(pid) && pid > 0 ? pid : null;
}

export function getPidFilePath() {
  return pidFile;
}

export function isProcessRunning(pid) {
  if (!pid) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function getRunningServerPid() {
  const pid = readPidFile();
  if (!pid) {
    return null;
  }

  if (!isProcessRunning(pid)) {
    clearServerPid();
    return null;
  }

  return pid;
}

export function writeServerPid(pid) {
  writeFileSync(pidFile, String(pid), "utf8");
}

export function clearServerPid() {
  if (existsSync(pidFile)) {
    rmSync(pidFile, { force: true });
  }
}

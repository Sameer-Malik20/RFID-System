import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { pingDatabase } from "./models/workspaceModel.js";
import { pool } from "./config/database.js";
import { initializeDatabase } from "./services/seedService.js";
import { clearServerPid, getRunningServerPid, writeServerPid } from "./utils/processManager.js";

const app = createApp();
let server;

async function shutdown(exitCode = 0) {
  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
  } catch (error) {
    console.error("Failed to close HTTP server cleanly:", error.message);
    exitCode = 1;
  } finally {
    clearServerPid();
    await pool.end();
    process.exit(exitCode);
  }
}

async function startServer() {
  try {
    const runningPid = getRunningServerPid();
    if (runningPid && runningPid !== process.pid) {
      console.error(`RFID System API is already running with PID ${runningPid}. Run npm run stop first if you want to restart it.`);
      process.exit(1);
      return;
    }

    await pingDatabase();
    if (env.autoSeed) {
      await initializeDatabase();
      console.log("Database schema checked and initial data ensured.");
    }
    server = app.listen(env.port, () => {
      writeServerPid(process.pid);
      console.log(`RFID System API listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    clearServerPid();
    process.exitCode = 1;
  }
}

startServer();

process.on("SIGINT", () => {
  shutdown(0);
});

process.on("SIGTERM", () => {
  shutdown(0);
});

process.on("exit", () => {
  clearServerPid();
});

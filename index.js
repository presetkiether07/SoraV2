const { spawn } = require("child_process");
const logger = require("./imports/logger");

async function start() {
  const bot = spawn('node sora.js', {
    cwd: __dirname,
    stdio: "inherit", // Ensures the stdio of the spawned process is directly inherited
    shell: true
  });

  // Log any errors that occur during spawn
  bot.on("error", (err) => {
    logger.error("Error spawning bot:", err);
  });

  // Check when the bot process closes
  bot.on("close", (code) => {
    if (code === 2) {
      logger.info("Bot is Restarting...");
      start();
    } else {
      logger.error(`Bot crashed with exit code ${code}`);
    }
  });
}

start();

const { spawn } = require("child_process");
const logger = require("./imports/logger");

async function start() {
  const bot = spawn('node sora.js', {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  bot.on("close", (code) => {
    if (code === 2) {
      logger.info("Bot is Restarting...");
      start();
    };
  });
};

start();
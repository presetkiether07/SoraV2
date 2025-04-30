const chalk = require("chalk");

const logger = new Object({
  info: (message) => {
    console.log(chalk.grey(`[ ${new Date().toLocaleTimeString()} | ℹ️ ]: ${message}`));
  },
  warn: (message) => {
    console.log(chalk.yellow(`[ ${new Date().toLocaleTimeString()} | ⚠️ ]: ${message}`));
  },
  success: (message) => {
    console.log(chalk.green(`[ ${new Date().toLocaleTimeString()} | ✅ ]: ${message}`));
  },
  error: (message) => {
    console.error(chalk.red(`[ ${new Date().toLocaleTimeString()} | ❌ ]: ${message}`));
  },
});

module.exports = logger;
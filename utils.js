const fs = require("fs-extra");
const logger = require("./imports/logger");
const path = require("path");

async function loadAll() {
  const errors = new Object({});

  const commandsPath = path.join(__dirname, "modules", "commands");
  const eventsPath = path.join(__dirname, "modules", "events");

  try {
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    commandFiles.forEach((file) => {
      const { commands } = global.Sora;
      try {
        const cmdFile = require(path.join(commandsPath, file));

        if (!cmdFile) {
          errors[file] = "Command file does not define anything!";
          logger.error(`Command file ${file} does not define anything!`);
        } else if (!cmdFile.config) {
          errors[file] = "Command file does not define a proper config!";
          logger.error(`Command file ${file} does not define a proper config!`);
        } else if (!cmdFile.onRun) {
          errors[file] = "Command file does not define a proper onRun function!";
          logger.error(`Command file ${file} does not define a proper onRun function!`);
        } else {
          commands.set(cmdFile.config.name, cmdFile);
        }
      } catch (error) {
        errors[file] = `An error occurred while loading command file: ${file}. ${error}`;
        logger.error(`An error occurred while loading command file: ${file}. ${error}`);
      }
    });

    eventFiles.forEach((file) => {
      const { events } = global.Sora;
      try {
        const eventFile = require(path.join(eventsPath, file));

        if (!eventFile) {
          errors[file] = "Event file does not define anything!";
          logger.error(`Event file ${file} does not define anything!`);
        } else if (!eventFile.config) {
          errors[file] = "Event file does not define a proper config!";
          logger.error(`Event file ${file} does not define a proper config!`);
        } else if (!eventFile.onEvent) {
          errors[file] = "Event file does not define a proper onEvent function!";
          logger.error(`Event file ${file} does not define a proper onEvent function!`);
        } else {
          events.set(eventFile.config.name, eventFile);
        }
      } catch (error) {
        errors[file] = `An error occurred while loading event file: ${file}. ${error}`;
        logger.error(`An error occurred while loading event file: ${file}. ${error}`);
      }
    });
  } catch (error) {
    errors["loadAll"] = `An error occurred while loading files. ${error}`;
    logger.error(`An error occurred while loading files. ${error}`);
  };

  return errors;
}

module.exports = { loadAll };
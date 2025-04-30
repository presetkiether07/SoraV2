/*
 * @name: SoraV2
 * @version: 1.0.0
 * @license: The LGPLv3 License.
 */

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

const fs = require("fs-extra");
const logger = require("./imports/logger");
const figlet = require("figlet");
const chalk = require("chalk");
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const login = require("./imports/login");

process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;
const app = new express();
app.set("view engine", "ejs");
app.use(require(path.join(
  __dirname, "routes", "root.js"
)));

global.Sora = new Object({
  startTime: new Date(),
  get config() {
    return JSON.parse(
      fs.readFileSync(path.join(__dirname, "json", "config.json"), "utf-8"),
    );
  },
  set config(config) {
    const data = global.Sora.config;
    const finalData = {
      ...data,
      ...config
    }
    const str = JSON.stringify(finalData, null, 2);
    fs.writeFileSync(path.join(__dirname, "config.json"), str);
  },
  botPrefix: global.Sora.config.botPrefix,
  botAdmins: global.Sora.config.botAdmins,
  commands: new Map(),
  events: new Map(),
  cooldowns: {},
  reactions: {},
});

const config = global.Sora.config;

global.Data = new Object({
  currentUserID: null,
  allUsersID: null,
  allThreadsID: null,
  adminInfos: new Map(),
});

async function start() {
  const utils = require("./utils");
  global.utils = utils;
  const appState = fs.readJSONSync(
    path.join(
      __dirname, 'json', 'state.json'
    )
  );

  figlet.text("SoraV2", (err, data) => {
    if (err) return logger.error(err);

    console.log(chalk.cyan(data));
    console.log(chalk.blue(`> Bot Name: [ ${config.botName} ]`));
    console.log(chalk.blue(`> Bot Prefix: [ ${config.botPrefix} ]`));
    console.log(chalk.blue(`> Current Time: [ ${new Date().toLocaleTimeString ()} ]`));
    console.log();

    login({
      appState
    }, (err, api) => {
      if (err) return logger.error(err);

      api.setOptions(config.fcaOptions);

      api.listen(async, (err, event) => {
        if (err) return logger.error(err);

        if (event.senderID !== api.getCurrentUserID()) {
          const listener = require("./imports/listener");
          listener({ api, event });
        };
      });
    });
  });
};

start();
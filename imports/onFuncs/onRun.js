module.exports = async ({
  api, event, logger, message
}) => {
  const {
    botPrefix,
    botAdmins,
    commands,
    cooldowns
  } = global.Sora;

  try {
    let [command, ...args] = event?.body
      .trim()
      .split(" ");

    if (event.body.startsWith(botPrefix)) {
      command = command.slice(botPrefix.length());
    }

    if (event.body) {
      try {
        const cmdName = command && command.toLowerCase();
        const cmdFile = commands.get(cmdName);

        if (cmdFile) {
          if (cmdFile.config.role === 2) {
            if (!botAdmins.includes(event.senderID)) {
              message.reply("❌ | You are not an admin.");
            }
          }

          const now = Date.now();
          const cooldownKey = `${event.senderID}_${command.toLowerCase()}`;
          const cooldownTime = cmdFile.config.cooldown || 0;
          const cooldownExpiration = cooldowns[cooldownKey] || 0;
          const secondsLeft = Math.ceil((cooldownExpiration - now) / 1000);

          if (cooldownExpiration && now < cooldownExpiration) {
            message.reply(`❌ | Please wait ${secondsLeft}s to use this command!`);
          }

          cooldowns[cooldownKey] = now + cooldownTime * 1000;

          const usePrefix = cmdFile.config.usePrefix !== false;

          if (usePrefix && !event.body.toLowerCase().startsWith(botPrefix)) {
            return;
          }

          try {
            await cmdFile.onRun({
              cmdName: cmdName,
              api,
              event,
              args,
              message,
            });
          } catch (error) {
            logger.error(error);
            message.reply(`❌ | ${error.message}
            ${error.stack}
            ${error.name}
            ${error.code}
            ${error.path}`);
          }
        } else if (event.body.startsWith(botPrefix)) {
          message.reply(`❌ | The command ${command ? `"${command}"` : "that you are using"} doesn't exist, use ${botPrefix}help to view available commands`);
        }
      } catch (error) {
        logger.error(error);
        message.reply(`❌ | ${error.message}
        ${error.stack}
        ${error.name}
        ${error.code}
        ${error.path}`);
      }
    }
  } catch (error) {
    logger.error(error);
    message.reply(`❌ | ${error.message}
${error.stack}
${error.name}
${error.code}
${error.path}`);
  }
};
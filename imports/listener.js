module.exports = async ({ api, event }) => {
  const logger = require("./logger");
  const onRun = require("./onFuncs/onRun"); // Kung wala ito, okay lang muna tanggalin

  // Init user ID
  global.Data.currentUserID = api.getCurrentUserID();

  // Reaction system
  const reactions = global.Sora.reactions || {};
  global.Sora.reactions = reactions;

  const message = {
    react: (emoji) => {
      api.setMessageReaction(emoji, event.messageID, () => {}, true);
    },
    reply: (msg) => {
      return new Promise((res) => {
        api.sendMessage(
          msg,
          event.threadID,
          (_, info) => res(info),
          event.messageID,
        );
      });
    },
    add: (uid) => api.addUserToGroup(uid, event.threadID),
    kick: (uid) => api.removeUserFromGroup(uid, event.threadID),
    send: (msg) => {
      return new Promise((res) => {
        api.sendMessage(msg, event.threadID, (_, info) => res(info));
      });
    },
    edit: (msg, mid) => {
      return new Promise((res) => {
        api.editMessage(msg, mid, () => res(true));
      });
    },
    waitForReaction: (body, next = "") => {
      return new Promise(async (resolve, reject) => {
        const i = await message.reply(body);
        reactions[i.messageID] = {
          resolve,
          reject,
          event: i,
          next,
          author: event.senderID,
        };
        logger.info(`New pending reaction at: `, i);
      });
    },
  };

  // Reaction Handler
  if (event.type === "message_reaction" && reactions[event.messageID]) {
    logger.info(`Detected Reaction at ${event.messageID}`);
    const {
      resolve,
      reject,
      event: i,
      author,
      next,
    } = reactions[event.messageID];

    try {
      if (author === event.userID) {
        logger.info(`${event.reaction} Resolved Reaction at ${event.messageID}`);
        delete reactions[event.messageID];
        if (next) {
          await message.edit(next, i.messageID);
        }
        resolve?.(event);
      } else {
        logger.info(`${event.reaction} Ignored: Different user`);
      }
    } catch (err) {
      logger.error(err);
      reject?.(err);
    }
    return;
  }

  // Message Handler
  if (event.type === "message") {
    // Placeholder: dito mo ilalagay ang command handler mo
    // example:
    // require("./commandHandler")({ api, event, message });
  }
};

const axios = require("axios");

module.exports = {
  config: {
    name: "akhiro",
    version: "1.0.0",
    author: "AkhiroDEV",
    description: "Talk to AkhiroAI",
    usage: "{p}akhiro [query]"
  },
  async onRun ({ api, event, args }){
    const query = args.join(" ");
    if (!query) {
      return api.sendMessage(`ℹ️ | Please create a question.`, event.threadID, event.messageID)
    }
    try {
      const response = await axios.get(`https://akhiro-rest-api.onrender.com/api/akhiro?q=${encodeURIComponnent(query)}`);
      const answer = response.data.content;
      api.sendMessage(answer, event.threadID, event.messageID)
    } catch (error) {
      console.log(error);
      api.sendMessage("Error: " + error.message, event.threadID, event.messageID)
    }
  }
}
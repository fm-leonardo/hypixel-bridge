const { Util } = require('discord.js');
const { minebot, toDiscordChat } = require('../../../app');

module.exports = {
   name: 'guildChat',
   async execute(rank, playername, grank, message) {
      if (playername === minebot.username) return;
      toDiscordChat(`<:MC:924396814642319370> **${rank ?? ''}${playername}: ${Util.escapeMarkdown(message)}**`);
   },
};

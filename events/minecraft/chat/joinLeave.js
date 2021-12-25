const { minebot, toDiscordChat } = require('../../../app');

module.exports = {
   name: 'joinLeave',
   async execute(playername, joinLeave) {
      if (playername === minebot.username) return;
      toDiscordChat(`<:hypixel:924394726709411880> **${playername} ${joinLeave}.**`);
   },
};

const { toDiscordChat } = require('../../../app');

module.exports = {
   name: 'getOnline',
   async execute(numOfOnline) {
      // —— Bot reconnection log
      plural = numOfOnline - 1 !== 1
      toDiscordChat(
         `:information_source: Bot has reconnected to Hypixel. There ${plural ? 'are' : 'is'} **${numOfOnline - 1}** other member${plural ? 's' : ''} online.`
      );
   },
};

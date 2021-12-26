require('dotenv').config();
const { WebhookClient, MessageEmbed } = require('discord.js');
const { toDiscordChat, bot } = require('../../../app');
const getCurrentUnix = require('../../../func/getCurrentUnix');
const getAvatar = require('../../../func/getAvatar');
const getPlayerDiscord = require('../../../func/getPlayerDiscord');
const config = require('../../../config');

module.exports = {
   name: 'newMember',
   async execute(rank, playername) {
      const guildWebhook = new WebhookClient({
         url: process.env.GUILD_WEBHOOK,
      });
      const unix = getCurrentUnix();
      const avatar = getAvatar(playername);
      const discordTag = await getPlayerDiscord(playername);

      toDiscordChat(`<a:join:830746278680985620> ${playername} joined the guild!`);
      if (playername === 'Guild') return console.log('newMember debug: Success.');

      const discordObject = bot.users.cache.find((user) => user.tag === discordTag) ?? 'Not Found';
      const newMember = new MessageEmbed()
         .setColor(config.colours.success)
         .setAuthor(playername, avatar)
         .setFooter(`A new member joined the guild!`)
         .setDescription(`**Joined**: <t:${unix}:F> (<t:${unix}:R>)\n**Discord**: ${discordObject} / ${discordTag}`)
         .setTimestamp();
      guildWebhook.send({ embeds: [newMember] });
   },
};

/*
   - Welcome! This is a Discord bot used to connect Minecraft chat to 
     Discord and vice versa. Open source, with love from xMdb. ❤

   - This is mainly for the Hypixel Knights Discord server,
     but you can also easily adapt the code to work in your own server,
     or use it in your own project.

   - Read more about this bot in the README.md!

   ! WARNING
   | This application will login to Hypixel using Mineflayer which is not a 
   | normal Minecraft client, this could result in your Minecraft account 
   | getting banned from Hypixel, so use this application at your own risk. 
   | I am not liable for any damages and no warranty is provided as outlined
   | in GPL-3.0 License.                                                      */

// ██████ Integrations █████████████████████████████████████████████████████████

require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});
const chalk = require('chalk');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, Util, WebhookClient } = require('discord.js');
const bot = new Client({
   allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
   intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
});
const mineflayer = require('mineflayer');
const config = require('./config');
const regex = require('./func/regex');

async function toDiscordChat(msg) {
   return bot.guilds.cache.get(config.ids.server).channels.cache.get(config.ids.guildChannel).send({
      content: msg,
   });
}

// ██████ Discord Bot: Events Init ██████████████████████████████████████████
const discordEvents = fs.readdirSync('./events/discord').filter((file) => file.endsWith('.js'));
for (const file of discordEvents) {
   const event = require(`./events/discord/${file}`);
   if (event.runOnce) {
      bot.once(event.name, (...args) => event.execute(...args));
   } else {
      bot.on(event.name, (...args) => event.execute(...args));
   }
}

// ██████ Minecraft Bot: Initialization ████████████████████████████████████████

function spawnBot() {
   const minebot = mineflayer.createBot({
      username: process.env.MC_USER,
      password: process.env.MC_PASS,
      host: 'hypixel.net',
      version: '1.12.2',
      logErrors: 'true',
      hideErrors: 'false',
      checkTimeoutInterval: 30000,
      interval: 5000,
   });

   module.exports = { minebot, toDiscordChat, bot };

   /*
   // ██████ Discord Bot: Command Init ██████████████████████████████████████████
   commands = [];
   const commandFolders = fs.readdirSync('./commands');
   for (const folder of commandFolders) {
      const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
      for (const file of commandFiles) {
         const command = require(`./commands/${folder}/${file}`);
         commands.push(command.data.toJSON());
      }
   }
   const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

   (async () => {
      try {
         console.log(chalk.green('Registering commands...'));

         await rest.put(
            Routes.applicationGuildCommands(config.ids.bot, config.ids.server),
            { body: commands }
         )
      } catch (err) {
         console.log(chalk.red(err));
      }
   });
   */

   // ██████ Minecraft Bot: Handler ██████████████████████████████████████████████
   rl.on('line', async (input) => {
      minebot.chat(input);
   });

   const chatEvents = fs.readdirSync('./events/minecraft/chat').filter((file) => file.endsWith('.js'));
   const handleEvents = fs.readdirSync('./events/minecraft/handler').filter((file) => file.endsWith('.js'));
   for (const file of chatEvents) {
      const event = require(`./events/minecraft/chat/${file}`);
      minebot.on(event.name, (...args) => event.execute(...args));
      minebot.chatAddPattern(regex[event.name], `${event.name}`);
   }
   for (const file of handleEvents) {
      const event = require(`./events/minecraft/handler/${file}`);
      minebot.on(event.name, (...args) => event.execute(...args));
   }

   // —— Bot reconnection message
   setTimeout(() => {
      minebot.chat('/g online');
   }, 10000);

   // ██████ Discord -> Minecraft ███████████████████████████████████████████████
   bot.on('messageCreate', async (message) => {
      try {
         if (
            message.author.id === bot.user.id ||
            message.channel.id !== config.ids.guildChannel ||
            message.author.bot ||
            message.content.startsWith(config.bot.prefix) ||
            !message.content.trim().length
         ) {
            return;
         }
         minebot.chat(`/gc ${message.member.displayName} > ${message.content}`);
         toDiscordChat(
            `<:discord:924396652251455538> **${message.member.displayName}: ${Util.escapeMarkdown(message.content)}**`
         );

         await message.delete();
      } catch (err) {
         console.log(err);
         message.channel.send({
            content: `**:warning: ${message.author}, there was an error while performing that task.**`,
         });
      }
      if (message.content.startsWith(`/`)) {
         toDiscordChat(`https://media.tenor.com/images/e6cd56fc29e429ff89fef2fd2bdfaae2/tenor.gif`);
      }
   });
}

if (process.env.ENVIRONMENT === 'prod') {
   setTimeout(() => {
      spawnBot();
   }, 5000);
}

if (process.env.ENVIRONMENT === 'dev') {
   setTimeout(() => {
      console.log(
         chalk.yellowBright(
            'This is where the bot should login to Hypixel.\nYou are seeing this because you have the environment value in .env set to dev.'
         )
      );
   }, 5000);
}

if (process.env.ENVIRONMENT === undefined) {
   throw new Error(
      'Please set the ENVIRONMENT value in your .env file to either prod or dev to enable/disable the Minecraft bot.'
   );
}

// ██████ Discord Bot: Command Handler █████████████████████████████████████████

bot.on('interactionCreate', async (interaction) => {
   // —— Run command
   if (!bot.commands.has(interaction.commandName)) return;
   if (!interaction.isCommand() && !interaction.isContextMenu()) return;
   try {
      await bot.commands.get(interaction.commandName).execute(interaction, bot);
   } catch (err) {
      const webhook = new WebhookClient({
         url: process.env.ERROR_WEBHOOK,
      });
      console.error(err);
      await interaction.reply({
         content: config.messages.errorDev,
         ephemeral: true,
      });
      webhook.send(`**General command error:** \`\`\`${err}\`\`\``);
   }
});

process.on('uncaughtException', (err) => console.error(err)).on('unhandledRejection', (err) => console.error(err));

// —— Login the bot
bot.login(process.env.BOT_TOKEN);

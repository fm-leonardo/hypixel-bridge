const chalk = require('chalk');
const { minebot } = require('../../../app');

module.exports = {
   name: 'login',
   async execute() {
      // —— Send to Limbo on login
      setTimeout(() => {
         console.log(chalk.greenBright('Successfully joined Hypixel.'));
         console.log(chalk.greenBright('Logged in.'));
         minebot.chat('/ac \u00a7');
      }, 5000);
   },
};

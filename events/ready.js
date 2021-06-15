const chalk = require('chalk');
const config = require('../config.json');

module.exports.run = (client) => {
    console.clear()
    console.log(chalk.whiteBright("────────────────────────────────────────────────────────────"));
    console.log(chalk.greenBright(`• Bot: ${chalk.blueBright(client.user.tag)} is now online!`));
    console.log(chalk.greenBright(`• Loaded: ${chalk.blueBright(client.commands.size)} commands!`));
    console.log(chalk.greenBright(`• Prefix: ${chalk.blueBright(config.prefix)}`));
    console.log(chalk.whiteBright("────────────────────────────────────────────────────────────"));

    client.user.setActivity({
        name: config.prefix+"help" ,
        type: 'WATCHING'
    }); 
}
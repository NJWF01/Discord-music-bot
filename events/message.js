const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports.run = (client, message) => {

    let prefix = config.prefix;
    if(!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if(!command) return;

    if (command.permissions) {
	    const authorPerms = message.channel.permissionsFor(message.author);
	    if (!authorPerms || !authorPerms.has(command.permissions)) {
		    const noperms = new discord.MessageEmbed()
			    .setColor("RED")
			    .setTitle("No Permission!")
			    .setDescription(`**You must have \`${command.permissions}\` permission to use this command.**`)
		    return message.channel.send(noperms);
	    }
    }
    command.run(client, message, args);
}
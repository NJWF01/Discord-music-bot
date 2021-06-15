const { MessageEmbed } = require('discord.js');
const { readdirSync } = require("fs");
const config = require('../config.json');

module.exports = {
    config: {
        name: 'help',
        description: 'Displays all commands that the bot has.',
        aliases: [""],
        usage: "[command name] (optional)",
        permissions: ["SEND_MESSAGES"],
    },
    async run(client, message, args){
        let prefix = config.prefix

        const embed = new MessageEmbed()
            .setColor(config.embedcolor)
            .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(`${message.guild.me.displayName} | Total Commands - ${client.commands.size} Loaded`, client.user.displayAvatarURL());

        let desc = "";
            
        if (!args[0]) {
            const commands = readdirSync("./commands/")
            commands.forEach(file => {

                if (!file.endsWith(".js")) return;
                let cmd = require(`../commands/${file}`);

                desc += `**${config.prefix}${cmd.config.name}** ${cmd.config.usage}\n`
            })
            embed.setDescription(desc)
            return message.channel.send(embed)
        } else {

            let command = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase());

            if (!command){
                const err = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`:x: **Invalid command!** **Do \`${prefix}help\` for the list of the Commands!**`)
                return message.channel.send(err);
            } 

            const embed = new MessageEmbed()
                .setColor(config.embedcolor)
        .setFooter(`Do ${prefix}help for all the commands.`, message.guild.iconURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`**${client.user.username}'s prefix is:** \`${prefix}\`

        **Command:** \`${command.config.name}\`
        **Description:** \`${command.config.description}\`
        **Aliases:** \`${command.config.aliases.join(", ") || "None"}\`
        **Usage:** \`${command.config.usage ? `${prefix}${command.config.name} ${command.config.usage}` : `${prefix}${command.config.name}`}\`
        **Permission:** \`${command.config.permissions || "None"}\``)
        return message.channel.send(embed);
        }
    }
}

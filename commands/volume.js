const { MessageEmbed } = require('discord.js')
const config = require('../config.json')


module.exports= {
    config: {
        name: 'volume',
        description: 'Changes Bots volume in call',
        aliases: [""],
        usage: '<# 1-10>',
        permissions: ["SEND_MESSAGES"],
    },

    async run(client, message, args) {
        const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('You should join a voice channel before using this command!');

    let queue = message.client.queue.get(message.guild.id)

    const embed = new MessageEmbed()
    .setDescription('The current volume is set to: ' + queue.volume)
    .setColor(config.embedcolor)

    if(!args[0]) return message.channel.send(embed)

    if(args[0] > 10) return message.channel.send('Please do volume (1 - 10)')

    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    queue.volume = args[0]
    const embed2 = new MessageEmbed()
        .setDescription('Volume is set to ' + args[0])
        .setColor(config.embedcolor)

    message.channel.send(embed2)
    }
}
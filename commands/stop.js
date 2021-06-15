const { MessageEmbed } = require('discord.js')
const config = require('../config.json')


module.exports= {
    config: {
        name: 'stop',
        description: 'Stops playing music',
        aliases: ["dc"],
        usage: '',
        permissions: ["SEND_MESSAGES"],
    },

    async run(client, message, args) {
        const embed = new MessageEmbed()
        .setDescription('There is no music to be stopped!')
        .setColor(config.embedcolor)


        const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('You should join a voice channel before using this command!');
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return message.channel.send(embed)
    message.react('✅')
    queue.songs = []
    queue.connection.dispatcher.end('Stopped!')

    }
}
const { MessageEmbed } = require('discord.js')
const config = require('../config.json')


module.exports= {
    config: {
        name: 'nowplaying',
        description: 'Shows the song currently playing',
        aliases: ["np"],
        usage: '',
        permissions: ["SEND_MESSAGES"],
    },

    async run(client, message, args) {
        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send('You should join a voice channel before using this command!');
        let queue = message.client.queue.get(message.guild.id)
        const embed1 = new MessageEmbed()
        .setDescription('There is nothing playing right now!')
        .setColor('RED')

        if(!queue) return message.channel.send(embed1)

        const embed2 = new MessageEmbed()
        .setTitle('Now Playing')
        .setDescription(queue.songs[0].title + ' Requested By: ' + '<@' + queue.songs[0].requester + '>')
        .setColor(config.embedcolor)
        .setThumbnail(queue.songs[0].thumbnail)

        message.channel.send(embed2)
    }
}
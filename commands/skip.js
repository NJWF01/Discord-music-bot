const { MessageEmbed } = require('discord.js')
const config = require('../config.json')


module.exports= {
    config: {
        name: 'skip',
        description: 'Skips Current song',
        aliases: [""],
        usage: '',
        permissions: ["SEND_MESSAGES"],
    },

    async run(client, message, args) {
        const embed = new MessageEmbed()
        .setDescription('There is nothing in the queue right now! add using ' + `${prefix}play <songName>`)
        .setColor(config.embedcolor)

        const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('You should join a voice channel before using this command!');
    let queue = message.client.queue.get(message.guild.id)
    if(!queue){ return message.channel.send(embed)
}
    if(queue.songs.length !== 0) {
        message.react('✅')
        queue.connection.dispatcher.end('Done the song skipped!')
    }
    }
}
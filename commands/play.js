const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const ytdl = require('ytdl-core-discord');
var scrapeYt = require("scrape-yt");

module.exports = {
    config: {
        name: 'play',
        description: 'plays a specified song in voice call',
        aliases: ["p"],
        usage: '<song name>',
        permissions: ["SEND_MESSAGES"],
    },
    async run(client, message, args){
        if(!args[0]) return message.channel.send('You didn\'t provide a song to play!')
    let channel = message.member.voice.channel;
    if(!channel) return message.channel.send('You need to join a voice channel to play a music!')

    if (!channel.permissionsFor(message.client.user).has("CONNECT")) return message.channel.send('I don\'t have permission to join the voice channel')
    if (!channel.permissionsFor(message.client.user).has("SPEAK"))return message.channel.send('I don\'t have permission to speak in the voice channel')


    const server = message.client.queue.get(message.guild.id);
    let video = await scrapeYt.search(args.join(' '))
    let result = video[0]

    const song = {
        id: result.id,
        title: result.title,
        duration: result.duration,
        thumbnail: result.thumbnail,
        upload: result.uploadDate,
        views: result.viewCount,
        requester: message.author,
        channel: result.channel.name,
        channelurl: result.channel.url
      };

    var date = new Date(0);
    date.setSeconds(song.duration);
    var timeString = date.toISOString().substr(11, 8);

      if (server) {
        server.songs.push(song);
        let embed = new MessageEmbed()
        .setTitle('Added to queue!')
        .setColor(config.embedcolor)
        .addField('Name', song.title, true)
        .setThumbnail(song.thumbnail)
        .addField('Views', song.views, true)
        .addField('Reqeusted By', song.requester, true)
        .addField('Duration', timeString, true)
        return message.channel.send(embed)
    }

    const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        volume: 2,
        playing: true
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);


    const play = async song => {
        const queue = message.client.queue.get(message.guild.id);
        if (!song) {
            queue.voiceChannel.leave();
            message.client.queue.delete(message.guild.id);
            return;
        }

        const dispatcher = queue.connection.play(await ytdl(`https://youtube.com/watch?v=${song.id}`, {
            filter: format => ['251'],
            highWaterMark: 1 << 25
        }), {
            type: 'opus'
        })
            .on('finish', () => {
                queue.songs.shift();
                play(queue.songs[0]);
            })
            .on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume / 5);
        let noiceEmbed = new MessageEmbed()
        .setTitle('Started Playing')
        .setColor(config.embedcolor)
        .setThumbnail(song.thumbnail)
        .addField('Name', song.title, true)
        .addField('Requested By', song.requester, true)
        .addField('Views', song.views, true)
        .addField('Duration', timeString, true)
        queue.textChannel.send(noiceEmbed);
    };


    try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0]);
    } catch (error) {
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`I could not join the voice channel: ${error}`);
  }
    }
}
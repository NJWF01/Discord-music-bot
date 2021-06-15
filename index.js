const discord = require('discord.js');
const chalk  = require('chalk')
const fs = require('fs');

const client = new discord.Client();
const config = require('./config.json');


client.queue = new Map()




client.commands = new discord.Collection();
client.aliases = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let pull = require(`./commands/${file}`);
        if (pull.config.name) {
            client.commands.set(pull.config.name, pull);
        }
        if (pull.config.aliases && Array.isArray(pull.config.aliases)) pull.config.aliases.forEach(alias => client.aliases.set(alias, pull.config.name));
    });
});

fs.readdir('./events/', (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        let eventFunc = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunc.run(client, ...args));
    });
});


client.on("voiceStateUpdate", async (___, newState) =>{
    if(!newState.selfDeaf){

        newState.setSelfDeaf(true);
    }
})

    



client.login(config.botToken).catch(err => {
    console.log('[ERROR] Invalid Bot Token')
});
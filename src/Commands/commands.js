const Command = require("../Structures/Command.js");
const Discord = require("discord.js");

/**
 * @param {Discord.MessageEmbed} embed 
 */
function getCommands(message, args, client){
    //TODO: rewrite to send 1 message for every 25 commands due to discord embed field limitations
    const fs = require("fs");

    var commands = [];

    fs.readdirSync('./src/Commands')
        .filter(file => file.endsWith(".js"))
        .forEach(file => {
            /**
             * @type {Command}
             */
            const command = require(`../Commands/${file}`);

            commands.push({
                name: client.prefix + command.name,
                value: command.description,
                inline: false,
            });
        }
    );

    commands.push({
        name: client.prefix + "skip",
        value: 'Skips the current song',
        inline: false,
    });

    return commands; 
}

/**
 * @param message
 * @param args
 * @param client
 */
function createEmbed(message, args, client){
    //TODO: rewrite to send 1 message for every 25 commands due to discord embed field limitations
    const embed = new Discord.MessageEmbed();

    embed.setTitle("Apollo")
        .setColor("BLURPLE")
        .setThumbnail(client.user.avatarURL({dynamic: true}))
        .setDescription(
            "Available commands:"
        )
        .addFields(getCommands(message, args, client));

    message.reply({embeds: [embed]});
}

module.exports = new Command({
    name: "commands",
    aliases: [],
    description: "Shows the available commands",
    permission: "SEND_MESSAGES",
    async run(message, args, client){
        //TODO: rewrite to send 1 message for every 25 commands due to discord embed field limitations
        createEmbed(message, args, client); 
    }
});
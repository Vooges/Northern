const Command = require("../Structures/Command.js");
const Discord = require("discord.js");

const config = require("../Data/config.json");

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
            const command = require(`../Commands/${file}`);

            let name = `${config.prefix}${command.name}`;

            if(command.aliases[0] !== null)
                name += `, aliases: `
                command.aliases.forEach(alias => {
                    name += `${config.prefix}${alias} `;
                });

            commands.push({
                name: name,
                value: command.description,
                inline: false,
            });
        }
    );
    return commands; 
}

function createEmbed(message, args, client){
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
        createEmbed(message, args, client); 
    }
});
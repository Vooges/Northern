const Command = require("../Structures/Command.js");
const Discord = require("discord.js");
const pjson = require("../../package.json");

async function createEmbed(message, args, client){
    const embed = new Discord.MessageEmbed();

    embed.setTitle("JDM.bot")
        .setColor("BLUE")
        .setThumbnail(client.user.avatarURL({dynamic: true}))
        .setDescription(
            "Multi-purpose bot"
        )
        .addFields({
            name: "Bot version",
            value: pjson.version,
            inline: true
        }, {
            name: "Prefix",
            value: client.prefix,
            inline: true
        }, {
            name: "Developer",
            value: "JDM",
            inline: true
        })

    message.reply({embeds: [embed]});
}

module.exports = new Command({
    name: "about",
    aliases: [],
    description: "Shows some general information about the bot and the Developer",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        createEmbed(message, args, client);
    }
});
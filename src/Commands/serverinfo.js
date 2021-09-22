const Command = require("../Structures/Command.js");
const Discord = require("discord.js");
const pjson = require("../../package.json");

async function createEmbed(message, args, client){
    const embed = new Discord.MessageEmbed();

    const serverInformation = {
        name: message.guild.name,
        icon: message.guild.icon,
        verificationLevel: message.guild.verificationLevel,
        memberCount: message.guild.memberCount,
        defaultMessageNotifications: message.guild.defaultMessageNotifications,
        premiumTier: message.guild.premiumTier,
    }

    embed.setTitle(serverInformation.name)
        .setColor("PURPLE")
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        .setDescription(
            "General server information"
        )
        .addFields({
            name: "Members",
            value: serverInformation.memberCount.toString(),
            inline: false
        }, {
            name: "Premium tier",
            value: serverInformation.premiumTier,
            inline: false
        }, {
            name: "Verification level",
            value: serverInformation.verificationLevel,
            inline: false
        }, {
            name: "Default notifications",
            value: serverInformation.defaultMessageNotifications,
            inline: false
        })

    message.reply({embeds: [embed]});

    //console.log(message.guild.fetchOwner());
}

module.exports = new Command({
    name: "serverinfo",
    description: "Shows some general information about the server",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        createEmbed(message, args, client);
    }
});
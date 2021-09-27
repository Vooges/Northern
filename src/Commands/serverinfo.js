const Command = require("../Structures/Command.js");
const Discord = require("discord.js");
const pjson = require("../../package.json");

async function createEmbed(message, args, client){
    try{
        const embed = new Discord.MessageEmbed();

        const owner = await message.guild.fetchOwner()

        const serverInformation = {
            name: message.guild.name,
            icon: message.guild.icon,
            verificationLevel: message.guild.verificationLevel,
            memberCount: message.guild.memberCount,
            defaultMessageNotifications: message.guild.defaultMessageNotifications,
            premiumTier: message.guild.premiumTier,
            serverOwner: owner.user.tag,
            afkChannel: message.guild.afkChannel.name,
            verified: message.guild.verified,
            createdAt: message.guild.createdAt.toUTCString(),
        }

        embed.setTitle(serverInformation.name)
            .setColor("GREYPLE")
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setDescription(
                "General server information"
            )
            .addFields({
                name: "Verified",
                value: serverInformation.verified || "False",
                inline: false
            }, {
                name: "Verification level",
                value: serverInformation.verificationLevel,
                inline: false
            }, {
                name: "Owner",
                value: serverInformation.serverOwner || "N/A",
                inline: false
            }, {
                name: "Members",
                value: serverInformation.memberCount.toString(),
                inline: false
            }, {
                name: "Default notifications",
                value: serverInformation.defaultMessageNotifications,
                inline: false
            }, {
                name: "Premium tier",
                value: serverInformation.premiumTier,
                inline: false
            }, {
                name: "AFK channel",
                value: serverInformation.afkChannel || "N/A",
                inline: false
            })
            .setFooter(`Server created at ${serverInformation.createdAt}`);

        message.reply({embeds: [embed]});
    } catch (error){
        console.error(error);

        message.reply("Something went wrong.");
    }
}

module.exports = new Command({
    name: "serverinfo",
    aliases: [],
    description: "Shows some general information about the server",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        createEmbed(message, args, client);
    }
});
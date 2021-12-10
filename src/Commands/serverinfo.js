const Command = require("../Structures/Command.js")
const Discord = require("discord.js")

async function createEmbed(message, args, client){
    try{
        const serverInformation = message.guild

        const embed = new Discord.MessageEmbed()
            .setTitle(serverInformation.name)
            .setColor("GREYPLE")
            .setThumbnail(message.guild.iconURL({dynamic: true}))
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
                value: serverInformation.afkChannel
                        ?serverInformation.afkChannel.name 
                        : "N/A",
                inline: false
            })
            .setFooter(`Server created at ${serverInformation.createdAt}`)

        message.reply({embeds: [embed]})
    } catch (error){
        client.logger.log(error, __filename)

        message.reply("Something went wrong.")
    }
}

module.exports = new Command({
    name: "serverinfo",
    aliases: [],
    description: "Shows some general information about the server",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        createEmbed(message, args, client)
    }
})
const Command = require("../Structures/Command.js")
const Discord = require("discord.js")

require('dotenv').config()

function getCommands(message, args, client){
    //TODO: rewrite to send 1 message for every 25 commands due to discord embed field limitations
    const fs = require("fs")

    var commands = []

    fs.readdirSync('./src/Commands')
        .filter(file => file.endsWith(".js"))
        .forEach(file => {
            const command = require(`../Commands/${file}`)

            let name = `${command.name}`

            if(command.aliases.length > 0){
                name = name.concat(`, aliases: ${command.aliases.join(", ")}`)
            }

            commands.push({
                name: name,
                value: command.description,
                inline: true,
            })
        }
    )
    return commands 
}

async function createEmbed(message, args, client){
    const embed = new Discord.MessageEmbed()
        .setTitle("Northern")
        .setColor("BLURPLE")
        .setThumbnail(client.user.avatarURL({dynamic: true}))
        .setDescription(`Prefix: ${process.env.prefix} | Available commands:`)
        .addFields(getCommands(message, args, client))

    message.reply({embeds: [embed]})
}

module.exports = new Command({
    name: "commands",
    aliases: [],
    description: "Shows the available commands",
    permission: "SEND_MESSAGES",
    async run(message, args, client){
        createEmbed(message, args, client) 
    }
})
const Command = require("../Structures/Command.js")

function seekOnTrack(message, args, client){
    const player = client.manager.players.get(message.member.guild.id)

    if(!player)
        return message.reply('Unable to seek since I\'m not in a voice channel')
    
    message.reply("This feature has not been implemented yet")
}

module.exports = new Command({
    name: "seek",
    aliases: [],
    description: "Seeks to the position in the current track",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        seekOnTrack(message, args, client)
    }
})
const Command = require("../Structures/Command.js")

function pausePlayer(message, args, client){
    const player = client.manager.players.get(message.member.guild.id)

    if(!player)
        return message.reply('Unable to shuffle since I\'m not in a voice channel')
    
    player.queue.shuffle()
    
    message.reply("Shuffled queue")
}

module.exports = new Command({
    name: "shuffle",
    aliases: [],
    description: "Shuffles the queue",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        pausePlayer(message, args, client)
    }
})
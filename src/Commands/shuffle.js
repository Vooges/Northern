const Command = require("../Structures/Command.js");

function pausePlayer(message, args, client){
    const player = client.manager.players.get(message.member.guild.id)

    if(!player)
        return message.reply('Unable to pause since I\'m not in a voice channel');
    
    player.queue.shuffle();
    
    message.reply("This feature has not been implemented yet");
}

module.exports = new Command({
    name: "pause",
    aliases: [],
    description: "Pauses the current song",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        pausePlayer(message, args, client);
    }
});
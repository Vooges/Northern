const Command = require("../Structures/Command.js");

function pausePlayer(message, args, client){
    const player = client.manager.players.get(message.member.guild.id)

    if(!player)
        return message.reply('Unable to pause since I\'m not in a voice channel');
    
    player.pause(!player.paused);

    return message.reply(`Set player paused to ${player.paused}`);
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
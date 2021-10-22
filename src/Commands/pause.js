const Command = require("../Structures/Command.js");

function pausePlayer(message, args, client){
    const player = client.manager.players.get(message.member.guild.id)

    if(!player)
        return message.reply('Unable to pause since I\'m not in a voice channel');
    
    player.pause(!player.paused);

    if(player.paused)
        return message.reply("Paused the player");

    return message.reply("Unpaused the player");
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
const Command = require("../Structures/Command.js");

require('dotenv').config();

function loop(message, args, client){
    const player = client.manager.players.get(message.member.guild.id)

    if(!player)
        return message.reply('Unable to loop since I\'m not in a voice channel');

    if(args[1] === "queue"){
        player.setQueueRepeat(!player.queueRepeat);

        if(player.queueRepeat)
            return message.reply("Repeating the queue");

        return message.reply("Stopped repeating the queue");
    } else if(args[1] === "song"){
        player.setTrackRepeat(!player.trackRepeat);

        if(player.trackRepeat)
            return message.reply("Repeating the song");

        return message.reply("Stopped repeating the song");
    }
    
    return message.reply(`Proper usage: \`${process.env.prefix}loop song\` or \`${process.env.prefix}loop queue\``);
}

module.exports = new Command({
    name: "loop",
    aliases: [],
    description: "Loops the current track or queue",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        loop(message, args, client);
    }
});
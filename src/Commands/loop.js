const Command = require("../Structures/Command.js");

const config = require("../Data/config.json");

function loop(message, args, client){
    const player = client.manager.players.get(message.member.guild.id)

    if(!player)
        return message.reply('Unable to loop since I\'m not in a voice channel');

    return message.reply("This feature has not been implemented yet");

    if(args[1] === "queue"){
        player.setQueueRepeat(!player.queueRepeat);

        return message.reply(`Set repeat queue to ${player.queueRepeat}`);
    } else if(args[1] === "song"){
        player.setTrackRepeat(!player.trackRepeat);

        return message.reply(`Set repeat song to ${player.trackRepeat}`);
    }
    
    return message.reply(`Proper usage: \`${config.prefix}loop song\` or \`${config.prefix}loop queue\``);
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
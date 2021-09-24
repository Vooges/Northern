const { getVoiceConnection } = require("@discordjs/voice");
const Command = require("../Structures/Command.js");
const Discord = require("discord.js");

function createField(queue){
    var songs = [];

    queue.forEach(function callback(value, index) {
        if(index !== 0){
            songs.push({
                name: `${index}: ${value.title}`,
                value: `url: ${value.url}`,
            });
        }
    });

    return songs;
}

function createEmbed(message, queue){
    const embed = new Discord.MessageEmbed();

    embed.setTitle(`${message.guild.name} queue`)
        .setColor("YELLOW")
        .setDescription(
            "Songs in queue:"
        )
        .addFields(createField(queue));

    return message.reply({embeds: [embed]});
}

module.exports = new Command({
	name: "queue",
	description: "Gets the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		const connection = getVoiceConnection(message.member.guild.id);

		if(!connection) return message.reply('Unable to display queue');

        //check if bot is in same channel as user

        queue = client.queue.get(message.member.guild.id);

        createEmbed(message, queue);
	}
});

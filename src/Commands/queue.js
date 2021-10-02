const config = require("../Data/config.json");

const Command = require("../Structures/Command.js");
const Discord = require("discord.js");

function createFields(queue) {
	let songs = [];

	if (queue.length === 0) {
		return [
			{
				name: "Queue is empty",
				value: `Use ${config.prefix}play or ${config.prefix}p to add a song to the queue`,
			},
		];
	}

	let index = 0;
	for (const song of queue) {
		if (song.requester) {
			const { username, discriminator } = song.requester;

			songs.push({
				name: `${index + 1}. ${song.title}`,
				value: `Requested by ${username}#${discriminator}`,
			});
		} else {
			songs.push({
				name: `${index + 1}. ${song.title}`,
				value: `by ${song.author}`,
			});
		}

		index++;
	}

	return songs;
}

function createEmbed(message, queue) {
	const embed = new Discord.MessageEmbed()
		.setTitle(`${message.guild.name} queue`)
		.setColor("YELLOW")
		.setDescription("Songs in queue:")
		.addFields(createFields(queue));

	return message.reply({ embeds: [embed] });
}

async function queue(message, args, client) {
	const player = client.manager.get(message.guild.id);
    
	if (!player) {
		return await message.reply("Not playing anything");
	}

	createEmbed(message, player.queue);
}

module.exports = new Command({
	name: "queue",
	aliases: [],
	description: "Gets the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		queue(message, args, client);
	},
});

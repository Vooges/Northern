const { getVoiceConnection } = require("@discordjs/voice");
const Command = require("../Structures/Command.js");

module.exports = new Command({
	name: "leave",
	aliases: [],
	description: "Leaves the voice channel",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		const connection = getVoiceConnection(message.member.guild.id);

		if(!connection)
			return message.reply('Unable to leave since I\'m not in a voice channel');

		//TODO: check if bot is in same channel as user

		connection.disconnect();

		client.voice.adapters
			.get(`${message.guild.id}`)
			.destroy();
		
		queue = client.queue;

		queue.delete(message.member.guild.id);

		message.reply("Left the channel");
	}
});

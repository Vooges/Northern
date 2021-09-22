const { getVoiceConnection } = require("@discordjs/voice");
const Command = require("../Structures/Command.js");

module.exports = new Command({
	name: "leave",
	description: "Leaves the voice channel",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		//check if bot is in channel

		//check if bot is in same channel as user

		const connection = getVoiceConnection(message.guild.id);

		connection.disconnect();

		client.voice.adapters
			.get(`${message.guild.id}`)
			.destroy();

		message.reply("Left the channel");
	}
});

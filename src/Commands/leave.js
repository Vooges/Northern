const { getVoiceConnection } = require("@discordjs/voice")
const Command = require("../Structures/Command.js")

module.exports = new Command({
	name: "leave",
	aliases: ["l"],
	description: "Leaves the voice channel",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		const player = client.manager.players.get(message.member.guild.id)

		if(!player)
			return message.reply('Unable to leave since I\'m not in a voice channel')

		//TODO: check if bot is in same channel as user

		player.destroy()

		message.reply("Left the channel")
	}
})

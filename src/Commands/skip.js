const Command = require("../Structures/Command");

async function skip(message, args, client) {
	args.shift();

	const player = client.manager.get(message.guild.id);

	if (!player) {
		return await message.reply("Not playing anything");
	}

	const amount = parseInt(args[0]);

	if(!amount){
		player.stop;

		return message.reply(`Skipped song: ${player.queue.get(0)}`);
	}

	const songs = player.queue.remove(-1, amount - 1);

	if (songs.length !== 0) {
		const songNames = songs.map((s) => `- ${s.title}\n`);
		
		return await message.reply(`Skipped songs:\n ${songNames}`);
	}
		
	return await message.reply("Nothing to skip");
}

module.exports = new Command({
	name: "skip",
	aliases: ["s"],
	description: "Skips a song",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		skip(message, args, client);
	},
});

const config = require("../Data/config.json");
const Command = require("../Structures/Command.js");

async function play(message, args, client) {
	args.shift();

	const query = args.join(" ");

	if (!query) {
		return await message.reply(
			`Correct usage: ${config.prefix}play or ${config.prefix}p **Song Name or URL**`
		);
	}

	const res = await client.manager.search(query, message.author);

    if(!message.member.voice.channel) {
        return await message.reply("You have to be in a voice channel to use this command!");
    }

	// Create a new player. This will return the player if it already exists.
	const player = client.manager.create({
		guild: message.guild.id,
		voiceChannel: message.member.voice.channel.id,
		textChannel: message.channel.id,
	});

	player.connect();

	// Adds the first track to the queue.
	player.queue.add(res.tracks[0]);
	message.channel.send(`Enqueuing track **${res.tracks[0].title}**.`);

	// Plays the player (plays the first track in the queue).
	// The if statement is needed else it will play the current track again
	if (!player.playing && !player.paused && !player.queue.size) {
		player.play();
	}

	// For playlists you'll have to use slightly different if statement
	if (
		!player.playing &&
		!player.paused &&
		player.queue.totalSize === res.tracks.length
	) {
		player.play();
	}
}

module.exports = new Command({
	name: "play",
	aliases: ["p"],
	description: "Play a song",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		play(message, args, client);
	},
});

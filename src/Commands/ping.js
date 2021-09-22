const Command = require("../Structures/Command.js");

async function measurePing(message, args, client){
	const msg = await message.reply(`Ping: ${client.ws.ping} ms.`);

	msg.edit(
		`Ping: ${client.ws.ping} ms.\nMessage Ping: ${
			msg.createdTimestamp - message.createdTimestamp
		}`
	);
}

module.exports = new Command({
	name: "ping",
	description: "Shows the ping of the bot!",
	permission: "SEND_MESSAGES",
	run(message, args, client) {
		measurePing(message, args, client);
	}
});

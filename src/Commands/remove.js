const { getVoiceConnection } = require("@discordjs/voice");
const Command = require("../Structures/Command.js");
const config = require("../Data/config.json");
const queue = require("./queue.js");

function arrayRemove(arr, value) { 
	return arr.filter(function(e){ 
		return e == value; 
	});
}

function removeSongFromQueue(message, args, client){
	try {
		const connection = getVoiceConnection(message.member.guild.id);

		if(!connection)
			return message.reply('Unable to remove since there\'s no queue');

		queue = client.queue.get(message.member.guild.id);

		if(isNaN(args[1]) || args[1] < 1)
			return message.reply(`${args[1]} is not a valid number. Correct usage: ${config.prefix}remove 3`);

		if(queue.length < args[1])
			return message.reply(`${args[1]} is not a valid number. The queue is only: ${queuelength} long.`);

		const removed = queue[args[1]].title;

		client.queue.set(message.member.guild.id, arrayRemove(queue, args[1]));
		
		message.reply(`Removed **${removed}**`);
	} catch (error) {
		console.error(error);

		message.reply("Something went wrong.");
	}
}

module.exports = new Command({
	name: "remove",
	aliases: [],
	description: "Removes the specified song from the queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		removeSongFromQueue(message, args, client);
	}
});

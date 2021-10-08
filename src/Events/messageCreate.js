const Event = require("../Structures/Event.js");

const config = require("../Data/config.json");

function runUtilities(message, args, client){
	if(message.content.includes("discord.gg/")){
        message.channel.send(`<@${message.author.id}> don't advertise other servers!`);
		
		message.delete();
    }
}

module.exports = new Event("messageCreate", (client, message) => {
	if(message.channelId == "890570794504179762") return;

    if (message.author.bot) return;

	const args = message.content.substring(client.prefix.length).split(/ +/);

	runUtilities(message, args, client);

	if(!message) return;

	if (!message.content.startsWith(client.prefix)) return;

	const command = client.commands.find(cmd => cmd.name == args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

	if (!command) 
		return message.reply(`${args[0]} is not a valid command! \nUse \`${config.prefix}commands\` to see all available commands.`);

	const permission = message.member.permissions.has(command.permission, true);

	if (!permission)
		return message.reply(`You do not have the permission \`${command.permission}\` to run this command`);

	command.run(message, args, client);
});
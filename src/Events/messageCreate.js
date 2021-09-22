const Event = require("../Structures/Event.js");

module.exports = new Event("messageCreate", (client, message) => {
    if (message.author.bot) return;

	if (!message.content.startsWith(client.prefix)) return;

	const args = message.content.substring(client.prefix.length).split(/ +/);

	const command = client.commands.find(cmd => cmd.name == args[0]);

	if (!command) return message.reply(`${args[0]} is not a valid command! \nUse \`%commands\` to see all available commands.`);

	const permission = message.member.permissions.has(command.permission, true);

	if (!permission) return message.reply(
		`You do not have the permission \`${command.permission}\` to run this command`
	);

	command.run(message, args, client);
});
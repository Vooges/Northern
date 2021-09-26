const Command = require("../Structures/Command");
const config = require("../Data/config.json");

function getUserFromMention(client, mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
    return;
}


async function banUser(message, args, client){
    const bannedUser = getUserFromMention(client, args[1]);

    if(!bannedUser)
        return message.reply(`No user specified. Correct usage: \`${config.prefix}ban @username reason\``);

    const reason = args.slice(2).join(" ");

    if(!reason)
        return message.reply(`No reason specified. Correct usage: \`${config.prefix}ban @username reason\``);

    try {
        await message.guild.members.ban(bannedUser, { reason });

        message.reply(`Banned **${bannedUser}** - reason: ${reason}`);
    } catch (error) {
        console.error(error);

        return message.reply("Something went wrong");
    }
}

module.exports = new Command({
    name: "ban",
	aliases: [],
	description: "Bans the specified user",
	permission: "BAN_MEMBERS",
	run(message, args, client) {
		banUser(message, args, client);
	}
});
const Command = require("../Structures/Command");

require('dotenv').config();

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

async function removeRoleFromUser(message, args, client){
    try{
        const user = getUserFromMention(client, args[1]);

        if(!user)
            return message.reply(`No user specified. Correct usage: \`${process.env.prefix}giverole @username role\``);

        const roleName = args[2];

        if(!roleName)
            return message.reply(`No role specified. Correct usage: \`${process.env.prefix}giverole @username role\``);

        const role = message.guild.roles.cache.find(role => role.name === args[2]);

        if(!role)
            return message.reply(`No role found with name: **${roleName}**`);

        const guildMember = await message.guild.members.fetch(user.id);

        guildMember.roles.remove(role.id);

        return message.reply(`Removed role ${args[2]} from ${args[1]}`);
    } catch(error){
        console.log(error);

        message.reply("Something went wrong");
    }
}

module.exports = new Command({
    name: "removerole",
    aliases: [],
    description: "Removes role from mentioned user",
    permission: "MANAGE_ROLES",
    run(message, args, client){
        removeRoleFromUser(message, args, client);
    }
});
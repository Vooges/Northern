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

async function addRoleToUser(message, args, client){
    try{
        const user = getUserFromMention(client, args[1]);

        if(!user)
            return message.reply(`No user specified. Correct usage: \`${config.prefix}giverole @username role\``);

        const roleName = args[2];

        if(!roleName)
            return message.reply(`No role specified. Correct usage: \`${config.prefix}giverole @username role\``);

        const role = message.guild.roles.cache.find(role => role.name === args[2]);

        if(!role)
            return message.reply(`No role found with name: **${roleName}**`);

        const guildMember = await message.guild.members.fetch(user.id);

        guildMember.roles.add(role.id);

        return message.reply(`Gave ${args[1]} role ${args[2]}`);
    } catch(error){
        console.log(error);

        message.reply("Something went wrong");
    }
}

module.exports = new Command({
    name: "giverole",
    aliases: [],
    description: "Gives role to mentioned user",
    permission: "MANAGE_ROLES",
    run(message, args, client){
        addRoleToUser(message, args, client);
    }
});
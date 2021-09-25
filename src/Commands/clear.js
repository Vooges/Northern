const Command = require("../Structures/Command.js");

async function clearMessages(message, args, client){
    const amount = args[1];

        if(!amount || isNaN(amount)) 
            return message.reply(`\`${amount == undefined ? "Nothing" : amount}\` is not a valid number`);

        const amountParsed = parseInt(amount);

        if(amountParsed > 100) 
            return message.reply("You cannot clear more than 100 messages");

        message.channel.bulkDelete(amountParsed);

        const msg = await message.channel.send(`Cleared ${amountParsed} messages!`);

        setTimeout(() => msg.delete(), 5000);
}

module.exports = new Command({
	name: "clear",
    aliases: [],
	description: "Clear an amount of messages",
	permission: "MANAGE_MESSAGES",
	run(message, args, client) {
		clearMessages(message, args, client);
	}
});
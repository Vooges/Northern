const Command = require("../Structures/Command.js");

async function clearMessages(message, args, client){
    try{
        const amount = args[1];

        if(!amount || isNaN(amount)) 
            return message.reply(`\`${amount == undefined ? "Nothing" : amount}\` is not a valid number`);

        const amountParsed = parseInt(amount);

        if(amountParsed > 100) 
            return message.reply("You cannot clear more than 100 messages at a time");

        await message.channel.bulkDelete(amountParsed);

        const msg = await message.channel.send(`Cleared ${amountParsed} messages!`);

        setTimeout(() => msg.delete(), 5000);
    } catch (error){
        console.error(error);

        message.reply("Something went wrong.");
    }
}

module.exports = new Command({
	name: "clear",
    aliases: [],
	description: "Clear up to 100 messages at a time",
	permission: "MANAGE_MESSAGES",
	run(message, args, client) {
		clearMessages(message, args, client);
	}
});
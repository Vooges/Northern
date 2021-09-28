const Command = require("../Structures/Command");
const config = require("../Data/config.json");

function randomNumber(min, max) {
    return (Math.floor(Math.random() * (max - min + 1) + min) + 1);
}

module.exports = new Command({
    name: "random",
    aliases: [],
    description: "Generates a random number between the specified numbers",
    permission: "SEND_MESSAGES",
    run(message, args, client){
        if(isNaN(args[1]))
            return message.reply(`${args[1] || "null"} is not a number. Correct usage: ${config.prefix}random 1 5`);
        
        if(isNaN(args[2]))
            return message.reply(`${args[2] || "null"} is not a number. Correct usage: ${config.prefix}random 1 5`);
        
        if(args[1] > args[2])
            return message.reply(`The first number cannot be greater than the second number. Correct usage: ${config.prefix}random 1 5`);

        const random = randomNumber(args[1], args[2]);

        return message.reply(`Random number: **${random}**`);
    }
});
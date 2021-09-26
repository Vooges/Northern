const Discord = require("discord.js");

const config = require("../Data/config.json");
const intents = new Discord.Intents(32767);

class Client extends Discord.Client {
	constructor() {
		super({
			 intents,
			 allowedMentions: {
					repliedUser: false
				} 
			});

		this.commands = new Discord.Collection();
		this.prefix = config.prefix;
		this.token = config.token;
		this.queue = new Map();
	}

	start(){
		const fs = require("fs");

		fs.readdirSync("./src/Commands")
			.filter(file => file.endsWith(".js"))
			.forEach(file => {
				const command = require(`../Commands/${file}`);

				console.log(`Command ${command.name} loaded`);

				this.commands.set(command.name, command);
			}
		);

		fs.readdirSync('./src/Events')
			.filter(file => file.endsWith(".js"))
			.forEach(file => {
				const event = require(`../Events/${file}`);

				console.log(`Event ${event.event} loaded`);

				this.on(event.event, event.run.bind(null, this));
			}
		);
		this.login(this.token);
	}
}

module.exports = Client;

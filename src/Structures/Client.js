require('dotenv').config()

const Discord = require("discord.js")
const intents = new Discord.Intents(32767)

class Client extends Discord.Client {
	constructor() {
		super({
			intents,
			allowedMentions: {
				repliedUser: false,
			},
		})

		this.commands = new Discord.Collection()
		this.prefix = process.env.prefix
		this.token = process.env.token
	}

	start() {
		const fs = require("fs")

		fs.readdirSync("./src/Commands")
			.filter((file) => file.endsWith(".js"))
			.forEach((file) => {
				const command = require(`../Commands/${file}`)

				this.logger.log(`Command ${command.name} loaded`)

				this.commands.set(command.name, command)
			})

		fs.readdirSync("./src/Events")
			.filter((file) => file.endsWith(".js"))
			.forEach((file) => {
				const event = require(`../Events/${file}`)

				this.logger.log(`Event ${event.event} loaded`)

				this.on(event.event, event.run.bind(null, this))
			})

		this.login(this.token)
	}
}

module.exports = Client

require('dotenv').config()

const Command = require("../Structures/Command.js")
const Discord = require("discord.js")

function createFields(queue, beginIndex) {
	let songs = []

	if (queue.length === 0) {
		return [
			{
				name: "Queue is empty",
				value: `Use ${process.env.prefix}play or ${process.env.prefix}p to add a song to the queue`,
			},
		]
	}

	let index = beginIndex
	for (const song of queue) {
		if (song.requester) {
			const { username, discriminator } = song.requester

			songs.push({
				name: `${index}. ${song.title}`,
				value: `Requested by: ${username}#${discriminator}`,
			})
		} else {
			songs.push({
				name: `${index}. ${song.title}`,
				value: `by: ${song.author}`,
			})
		}

		index++
	}

	return songs
}

function createEmbed(message, slicedQueue, currentTrack, page, maxPage){
	const embed = new Discord.MessageEmbed()
		.setTitle("Queue")
		.setColor("DARK_AQUA")
		.setDescription(`Currently playing: __**${currentTrack.title}**__\nSongs in queue:`)
		.addFields(createFields(slicedQueue, ((page * 10) - 10) || 1))
		.setFooter(`Page ${page} of ${maxPage}`)

	return embed
}

async function paginator(message, queue, currentTrack, page, client) {
	const maxPage = Math.ceil(queue.length / 10) || 1

	if(page > maxPage) page = maxPage

	const minSlice = (page * 10) - 10
	const maxSlice = (page * 10)

	const slicedQueue = queue.slice(minSlice, maxSlice)

	let embed = createEmbed(message, slicedQueue, currentTrack, page, maxPage)

	let queueMessage = await message.reply({ embeds: [embed] })
	await queueMessage.react('⬅️')
	await queueMessage.react('➡️')

	const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id !== message.author.id

	const collector = queueMessage.createReactionCollector(filter)

	var client = client //needed to use the logger cause lambdas are hard

	collector.on('collect', (reaction, user) => {
		client.logger.log(`Command queue: ${reaction.emoji.name} hit by ${user.tag}`)
		
		if(reaction.emoji.name === '➡️'){
			if(page < maxPage){
				page++
				const minSlice = (page * 10) - 10
				const maxSlice = (page * 10)

				const slicedQueue = queue.slice(minSlice, maxSlice)

				let newMaxPage = Math.ceil(slicedQueue.length / 10) || 1

				queueMessage.edit({ embeds: [createEmbed(message, slicedQueue, currentTrack, page, newMaxPage)] })
			}
		} else if(reaction.emoji.name === '⬅️'){
			if(page > 1){
				page--
				const minSlice = (page * 10) - 10
				const maxSlice = (page * 10)

				const slicedQueue = queue.slice(minSlice, maxSlice)

				let newMaxPage = Math.ceil(slicedQueue.length / 10) || 1

				queueMessage.edit({ embeds: [createEmbed(message, slicedQueue, currentTrack, page, newMaxPage)] })
			}
		}
	})
}

async function queue(message, args, client) {
	const player = client.manager.get(message.guild.id)
    
	if (!player) {
		return await message.reply("Not playing anything")
	}

	const currentTrack = player.queue.current

	var page = 1

	if(!isNaN(args[1]) && args[1] >= 1){
		page = args[1]
	}

	paginator(message, player.queue, currentTrack, page, client)
}

module.exports = new Command({
	name: "queue",
	aliases: [],
	description: "Gets the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		queue(message, args, client)
	},
})

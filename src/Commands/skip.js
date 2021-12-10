const Command = require("../Structures/Command")
const Discord = require("discord.js")

function msToHMS(duration){
	let hours = Math.floor((duration  / 1000 / 3600 ) % 24)
	let minutes = Math.floor((duration / 1000 / 60) % 60)
	let seconds = Math.floor((duration / 1000) % 60)

	minutes = String(minutes).padStart(2, '0')
	seconds = String(seconds).padStart(2, '0')
  	
	if(hours === 0){
		return [minutes, seconds].join(":")
	}

  	return [hours, minutes, seconds].join(":")
}

function showCurrentTrack(track, skipper){
	return new Discord.MessageEmbed()
        .setTitle(`Skipped:`)
        .setColor("DARK_RED")
        .setThumbnail(track.thumbnail)
        .setDescription(`${track.title}`)
        .addFields({
            name: "Duration",
            value: msToHMS(track.duration),
            inline: true
        })
		.setFooter(`Skipped by: ${skipper.tag}`, skipper.displayAvatarURL())
}

async function skip(message, args, client) {
	const player = client.manager.get(message.guild.id)

	if (!player) {
		return await message.reply("Not playing anything")
	}

	const voiceChannel = message.member.voice.channel

	if (!voiceChannel) {
		return await message.reply("You need to be in a voice channel")
	}

	const currentTrack = player.queue.current

	const skipper = message.member.user

	player.stop()

	message.reply({embeds: [showCurrentTrack(currentTrack, skipper)]})
}

module.exports = new Command({
	name: "skip",
	aliases: ["s"],
	description: "Skips a song",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		skip(message, args, client)
	},
})

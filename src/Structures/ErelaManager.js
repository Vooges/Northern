const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Discord = require("discord.js");

require('dotenv').config();

function msToHMS(duration){
	let hours = Math.floor((duration  / 1000 / 3600 ) % 24);
	let minutes = Math.floor((duration / 1000 / 60) % 60);
	let seconds = Math.floor((duration / 1000) % 60);

	minutes = String(minutes).padStart(2, '0');
	seconds = String(seconds).padStart(2, '0');
  	
	if(hours === 0){
		return [minutes, seconds].join(":");
	}

  	return [hours, minutes, seconds].join(":");
}

function showCurrentTrack(track){
	return new Discord.MessageEmbed()
        .setTitle(`Now playing:`)
        .setColor("AQUA")
        .setThumbnail(track.thumbnail)
        .setDescription(`${track.title}`)
        .addFields({
            name: "Duration",
            value: msToHMS(track.duration),
            inline: true
        })
		.setFooter(
			`Requested by: ${track.requester.username + "#" + track.requester.discriminator}`, 
			track.requester.displayAvatarURL()
		);
}

var timeout;

class ErelaManager extends Manager {
	constructor(client) {
		super({
			plugins: [
				new Spotify({
					clientID: process.env.spotify_clientId,
					clientSecret: process.env.spotify_clientSecret,
				})
			],
			nodes: [{
				host: process.env.erela_host,
				password: process.env.erela_password,
				port: parseInt(process.env.erela_port),
			}],
			send(id, payload) {
				const guild = client.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
		})
		.on("trackStart", (player, track) => { //sometimes gets called twice on first song since booting
			clearTimeout(timeout);

			client.channels.cache
			  	.get(player.textChannel)
			  	.send({embeds: [showCurrentTrack(track)]});
		})
		.on("queueEnd", (player) => {
			client.channels.cache
				.get(player.textChannel)
			  	.send("Queue has ended. Leaving the voice channel in 30 seconds.");
		
			timeout = setTimeout(function() {
				player.destroy();
			}, 30000);
		  })
		.on("trackStuck", (player, track) => {
			client.channels.cache
			  	.get(player.textChannel)
			  	.send(`Something broke while playing ${track.title}`);
		})
		.on("trackError", (player, track) => {
			client.channels.cache
			  	.get(player.textChannel)
			  	.send(`Something broke while playing ${track.title}`);
		});
	}
}

module.exports = ErelaManager;

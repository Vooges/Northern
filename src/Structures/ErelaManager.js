const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Discord = require("discord.js");

const config = require("../Data/config.json");

function msToHMS(ms) {
	const hours = Math.floor((ms  / 1000 / 3600 ) % 24);
	const minutes = Math.floor((ms / 1000 / 60) % 60);
	const seconds = Math.floor((ms / 1000) % 60);

	if(!hours){
		return [
			minutes.toString(),
			seconds.toString(),
		].join(":");
	}
  
	return [
		hours.toString(),
		minutes.toString(),
		seconds.toString(),
	].join(':');
}

function showCurrentTrack(track){
	return new Discord.MessageEmbed()
        .setTitle(`Now playing:`)
        .setColor("BLUE")
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
					clientID: config.spotify.clientId,
					clientSecret: config.spotify.clientSecret,
				})
			],
			nodes: [{
				host: config.erela.host,
				password: config.erela.password,
				port: config.erela.port,
			}],
			send(id, payload) {
				const guild = client.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
		})
		.on("trackStart", (player, track) => { //gets called twice on first song
			clearTimeout(timeout);

			client.channels.cache
			  	.get(player.textChannel)
			  	.send({embeds: [showCurrentTrack(track)]});
		})
		.on("queueEnd", (player) => {
			client.channels.cache
				.get(player.textChannel)
			  	.send("Queue has ended. Leaving the voice channel in 10 seconds.");
		
			timeout = setTimeout(function() {
				player.destroy();
			}, 10000);
		  });
	}
}

module.exports = ErelaManager;

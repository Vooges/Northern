const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");

const config = require("../Data/config.json");

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
		.on("trackStart", (player, track) => {
			client.channels.cache
			  	.get(player.textChannel)
			  	.send(`Now playing: ${track.title}`);
		})
		.on("queueEnd", (player) => {
			client.channels.cache
				.get(player.textChannel)
			  	.send("Queue has ended.");
		
			player.destroy();
		  });
	}
}

module.exports = ErelaManager;

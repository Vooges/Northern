const { Manager } = require("erela.js");
const config = require("../Data/config.json");

class ErelaManager extends Manager {
	constructor(client) {
		super({
			...config.erela,
			send(id, payload) {
				const guild = client.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
		});
	}
}

module.exports = ErelaManager;

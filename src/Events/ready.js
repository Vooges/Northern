const Event = require("../Structures/Event.js")
const pjson = require("../../package.json")

module.exports = new Event("ready", (client) => {
	client.user.setPresence({
		activities: [{ name: `version: ${pjson.version}` }],
		status: "online",
	})

	client.manager.init(client.user.id)

	client.logger.log("Northern is ready!")
	console.log("Northern is ready")
})

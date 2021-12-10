const Event = require("../Structures/Event.js")

module.exports = new Event("raw", (client, data) => {
	client.manager.updateVoiceState(data)
})

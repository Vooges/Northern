const Event = require("../Structures/Event.js");
const pjson = require("../../package.json");

module.exports = new Event("ready", (client) => {
    client.user.setPresence({
        activities: [{ name: `version: ${pjson.version}-dev` }],
        status: 'online',
    });

    console.log("Apollo is ready!");
});
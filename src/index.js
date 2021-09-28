console.clear();

const Client = require("./Structures/Client.js");
const ErelaManager = require("./Structures/ErelaManager.js");

const client = new Client();
client.manager = new ErelaManager(client);

client.start();

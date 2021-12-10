console.clear()

const Client = require("./Structures/Client.js")
const ErelaManager = require("./Structures/ErelaManager.js")
const Logger = require("./Structures/Logger.js")

const client = new Client()

client.logger = new Logger('Starting Northern')
client.manager = new ErelaManager(client)

client.start()

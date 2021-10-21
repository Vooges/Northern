# Northern

![Northern logo](src/Logos/logo.jpg)

### Features

* Music commands
* Retrieve Steam game/DLC info
* Server management
* Show server info
* Random number generator

### Built with

* [Node.js](https://nodejs.org/en/) - a JavaScript runtime environment
* [NPM](https://www.npmjs.com/) - a Node package manager
* [discord.js v13](https://discord.js.org/#/)

### Installation

* Run `npm install` to install all the necessary packages
* Create a `config.json` file (tip: use the `config.json.template` file)
* Download the latest version of [Lavalink](https://github.com/freyacodes/Lavalink/releases)
* Place Lavalink in the project root folder
* Follow the [configuration steps](https://github.com/freyacodes/Lavalink) for Lavalink

### Running the bot

* Run the `start.bat` file

Or manually run each command

* Run `java -jar lavalink.jar`
* Run `node .`

_Note: running `node .` before Lavalink finished booting up will cause the bot to fail_

### Troubleshooting

__Bot shows 'No available nodes' after running start.bat__
##### _Note: closing both command prompt windows and running `start.bat` again sometimes works_

Method 1:

* Run `java -jar lavalink.jar`
* Wait for lavalink to finish initializing
* Run `node .`

Method 2: 
* Change `timeout /t 10 /nobreak` in `start.bat` to a greater amount of seconds, e.g. `timeout /t 15 /nobreak`

const fs = require('fs')

function formatUTCDateForFile(){
    let currentDate = new Date()

    let dateParts = [
        currentDate.getUTCFullYear(),
        ("0" + currentDate.getUTCDate()).slice(-2),
        ("0" + currentDate.getUTCDay()).slice(-2),
        ("0" + currentDate.getUTCHours()).slice(-2),
        ("0" + currentDate.getUTCMinutes()).slice(-2),
        ("0" + currentDate.getUTCSeconds()).slice(-2),
        ("00" + currentDate.getUTCMilliseconds()).slice(-3)
    ]

    return dateParts.join("-")
}

class Logger {
    logDir = 'Logs'
    logFile = `${this.logDir}/${formatUTCDateForFile()}.txt`

    constructor(startUpString){
        if(!fs.existsSync(this.logDir)) fs.mkdir(this.logDir, (err) => {
            if(err) console.error(err)
        })

        let startUpMessage = `${formatUTCDateForFile()} | ${startUpString}`
        fs.writeFile(this.logFile, startUpMessage, (err) => {
            if(err) console.error(err)
        })
    }

    log(content, filePath){
        let timestamp = formatUTCDateForFile()
        let contentString = `\n${timestamp} | `

        if(filePath !== undefined) contentString += `${filePath} | `

        contentString += `${content}`

        fs.appendFile(this.logFile, contentString, (err) => {
            if(err) console.error(err)
        })
    }
}

module.exports = Logger
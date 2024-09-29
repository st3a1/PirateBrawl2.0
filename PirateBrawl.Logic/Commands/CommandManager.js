const fs = require('fs')

class CommandManager {
  constructor () {
    this.commands = {}

    fs.readdir('../Commands/Home', (err, files) => {
      if (err)console.log(err)
      files.forEach(e => {
        const Command = require(`../Commands/Home${e.replace('.js', '')}`)
        const commandClass = new Command()

        this.commands[commandClass.commandID] = Command
      })
    })
  }

  handle (id) {
    return this.commands[id]
  };

  getCommands () {
    return Object.keys(this.commands)
  }
}

module.exports = CommandManager
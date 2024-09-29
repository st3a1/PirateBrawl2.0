const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const Utils = require("../../../PirateBrawl.Titan/Utils/Utils")
const CommandManager = require("../../Commands/CommandManager")
const Commands = new CommandManager()


class EndClientTurnMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(bytes)
    this.bytes = bytes
    this.session = session
    this.id = 14102
    this.version = 0
    this.stream = new ByteStream(bytes)

  }

  async decode () {
    this.stream.readBoolean()
    this.tick = this.stream.readVInt()
    this.checksum = this.stream.readVInt()
    this.count = this.stream.readVInt()
  }

  async process () {
    const commands = Commands.getCommands()
    if (this.buffer != undefined){
    if(this.count == 0 && this.buffer.length > 32){ // in case if we receive broken command
        let lastEncount = 0
        let lastByte = 0
        do{
            lastEncount = this.offset
            lastByte = this.stream.readVInt()
        }while(!Utils.range(500, 600).includes(lastByte) && commands.indexOf(String(lastByte)) == -1)
            
        if(Utils.range(500, 600).includes(lastByte)){
            this.offset = lastEncount
            this.count = 2
        }
    }
}
    if(this.count == 0)return;

    for(let i = 0; i < this.count; i++){
        this.commandID = this.stream.readVInt()
        if (this.commandID >= 500 && this.commandID <= 550){
            this.stream.readVInt()
            this.stream.readVInt()
            this.stream.readVInt()
            this.stream.readVInt()
            if(commands.indexOf(String(this.commandID)) != -1){
                const command = new (Commands.handle(this.commandID))(this.bytes.slice(this.offset), this.session)
                console.log(`Command ${this.commandID} (${command.constructor.name}) handled!`)
                await command.decode(this)
                await command.process()
            }else{
                console.log(`Command ${this.commandID} isn't handled!`)
            }
        }
    }
    
  }
}

module.exports = EndClientTurnMessage
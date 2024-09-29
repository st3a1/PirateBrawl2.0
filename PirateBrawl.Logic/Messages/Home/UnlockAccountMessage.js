const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

//database Calling
//const database = require("../../Laser.Server/db")

const ok = require('./UnlockAccountOkMessage')
const failed = require('./UnlockAccountFailedMessage')

class UnlockAccountMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 10121
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.Code = this.stream.readString()
    this.state = this.stream.readVInt()
  }

  async encode () {
    this.stream.writeLong(0, this.session.lowID) // player LowID 
    this.stream.writeStr("") // i idk but i guess its maybe be a corr string 
    this.stream.writeStr("") // i idk but i guess its maybe be a corr string 
    this.stream.writeStr("") // i idk but i guess its maybe be a corr string 
  }

  async process () {
  if(this.code == "123412341234"){
  return await new ok(this.session).send()
  }else{
  return await new failed(this.session).send()
  }
  
  }
}

module.exports = UnlockAccountMessage
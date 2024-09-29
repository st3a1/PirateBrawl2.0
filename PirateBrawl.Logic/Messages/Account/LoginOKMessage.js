const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

class LoginOKMessage extends PiranhaMessage {
  constructor (session) {
    super(session)
    this.id = 20104
    this.session = session
    this.version = 1
    this.stream = new ByteStream()
  }

  async encode () {

    this.stream.writeLong(0, this.session.lowID)
    this.stream.writeLong(0, this.session.lowID)
    this.stream.writeString(this.session.token)

    this.stream.writeString() //Facebook ID
    this.stream.writeString() //Gamecenter ID

    this.stream.writeInt(19) 
    this.stream.writeInt(110) 
    this.stream.writeInt(0)

    this.stream.writeString("dev")

    this.stream.writeInt(0)
    this.stream.writeInt(0)
    this.stream.writeInt(0)

    this.stream.writeString()
    this.stream.writeString()
    this.stream.writeString()
    
    this.stream.writeInt(0)

    this.stream.writeString()
    this.stream.writeString("BY")
    this.stream.writeString()//Kuni ID 

    this.stream.writeInt(2)//Tier
    this.stream.writeString()
    this.stream.writeInt(2)//Url Entry Array Count
    this.stream.writeString("https://game-assets.brawlstarsgame.com")
    this.stream.writeString("http://a678dbc1c015a893c9fd-4e8cc3b1ad3a3c940c504815caefa967.r87.cf2.rackcdn.com")
    this.stream.writeInt(2)//Url Entry Array Count
    this.stream.writeString("https://github.com/itdlaloxov/image/blob/main")
    this.stream.writeString("https://24b999e6da07674e22b0-8209975788a0f2469e68e84405ae4fcf.ssl.cf2.rackcdn.com/event-assets")
    this.stream.writeVInt(0)//Seconds Until Account Deletion
  }
}

module.exports = LoginOKMessage

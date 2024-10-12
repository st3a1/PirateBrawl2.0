const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream");
const PiranhaMessage = require("../../../PirateBrawl.Titan/Message/PiranhaMessage");


class SetDeviceTokenMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 10113
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    this.DeviceToken = this.stream.readString()//this.stream.readByte()
    this.AntihackFlags = this.stream.readInt()
  }

  async process () {
  console.warn("[NEW PLAYER]  " + this.session.Name + "  " + this.session.lowID + "      " + this.DeviceToken)

 //             Stream.WriteStringReference(PassToken);
 //           Stream.WriteLong(AccountId); 26007 mess id
  }
}

module.exports = SetDeviceTokenMessage
const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const SetCountryResponseMessage = require('./SetCountryResponseMessage')
const Parse_Country = require("../../../GameFiles/regions")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

class SetCountryMessage extends PiranhaMessage {
  constructor(bytes, session) {
    super(session);
    this.id = 12998; // 20161
    this.session = session;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode() {
    this.country = this.stream.readDataReference()[1]
  }

  async encode() {
  this.stream.writeDataReference(14, this.country)
  }

  async process() {
  const account = await database.getAccount(this.session.lowID)
  account.Country = await Parse_Country(this.country)
  let idk = account.Country
  await new SetCountryResponseMessage(this.session, this.country).send()
  await database.replaceValue(this.session.lowID, 'Country', idk);
  console.log(this.country)
  console.log(account.Country)
  console.log(idk)
  console.log(this.session.Country)
  }
}

module.exports = SetCountryMessage;
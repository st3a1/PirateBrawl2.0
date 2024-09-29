const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const SetSupportedCreatorReponse = require('./SetSupportedCreatorReponse');
const LogicSetSupportedCreatorCommand = require('../../Commands/Home/LogicSetSupportedCreatorCommand');
const fs = require('fs').promises;

class SetSupportedCreatorMessage extends PiranhaMessage {
  constructor(bytes, session) {
    super(session);
    this.session = session;
    this.id = 18686;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode() {
    this.CodeName = this.stream.readString();
  }

  async process() {
    try {
      const AuthorsData = await fs.readFile('./Laser.Server/Authors.json', 'utf8');
      const AuthorParsed = JSON.parse(AuthorsData);

      const foundItem = AuthorParsed.find(item => item.CodeName === this.CodeName);

      if (this.CodeName == ""){
        this.session.AuthorCode = "";
        await database.replaceValue(this.session.lowID, 'AuthorCode', this.session.AuthorCode);
        return await new LogicSetSupportedCreatorCommand(this.session).send();
      }

      if (!foundItem) return await new SetSupportedCreatorReponse(this.session).send();

      if (foundItem){
        this.session.AuthorCode = this.CodeName;
        await database.replaceValue(this.session.lowID, 'AuthorCode', this.session.AuthorCode)
        return await new LogicSetSupportedCreatorCommand(this.session).send();
      }
    } catch (error) {
      console.error('Error processing SetSupportedCreatorMessage:', error);
    }
  }
}

module.exports = SetSupportedCreatorMessage;

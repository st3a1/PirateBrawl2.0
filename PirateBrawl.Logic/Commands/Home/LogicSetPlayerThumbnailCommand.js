const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const fs = require('fs').promises;
const LoginFailedMessage = require('../../Messages/Account/LoginFailedMessage')

class LogicSetPlayerThumbnailCommand extends PiranhaMessage{
    constructor(bytes, session){
        super(bytes)
        this.session = session;
        this.commandID = 505
        this.version = 0
        this.stream = new ByteStream(bytes)
    }

    decode(self){
        for (let i of Array(10).keys()){this.stream.readVInt()}   
        this.session.Thumbnail = this.stream.readVInt()
    }

    async process(){
        if(this.session.Thumbnail !== 0) return await database.replaceValue(this.session.lowID, 'Thumbnail', this.session.Thumbnail);
        const AuthorsData = await fs.readFile('./Laser.Server/Authors.json', 'utf8');
        const AuthorParsed = JSON.parse(AuthorsData);
        const foundItem = AuthorParsed.find(item => item.CreatorID === this.session.lowID);
        if (!foundItem) return new LoginFailedMessage(this.session, `Вы не являетесь Контент-Мейкром.`, 1).send();
        if (foundItem) return await database.replaceValue(this.session.lowID, 'Thumbnail', this.session.Thumbnail);
    }
}

module.exports = LogicSetPlayerThumbnailCommand
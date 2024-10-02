const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const LoginFailedMessage = require('../../Messages/Account/LoginFailedMessage')
const fs = require('fs');
class LogicSelectSkinCommand extends PiranhaMessage{
    constructor(bytes, session){
        super(bytes)
        this.session = session;
        this.commandID = 506
        this.version = 0        
        this.stream = new ByteStream(bytes);

    }

    decode(self){
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.SkinID = this.stream.readVInt();
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.stream.readVInt()
        this.BrawlerID = this.stream.readVInt();
    }

    async process(){
        const account = await database.getAccount(this.session.lowID) 
        const Brawler = account.Brawlers.find(brawler => brawler.id === this.BrawlerID);
        if(Brawler.unlocked){
            this.session.BrawlerID = this.BrawlerID
            this.session.SkinID = this.SkinID
            await database.replaceValue(this.session.lowID, 'SkinID', this.skinID);
            await database.replaceValue(this.session.lowID, 'BrawlerID', this.BrawlerID);
        }else{
            return new LoginFailedMessage(this.session, `Произошла ошибка 506. Перезайдите в игру`, 1).send();

        }
    }
}
module.exports = LogicSelectSkinCommand
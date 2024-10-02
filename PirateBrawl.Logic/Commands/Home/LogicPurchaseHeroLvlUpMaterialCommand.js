const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager");
const LoginFailedMessage = require('../../Messages/Account/LoginFailedMessage')
const fs = require('fs');
class LogicPurchaseHeroLvlUpMaterialCommand extends PiranhaMessage{
    constructor(bytes, session){
        super(bytes)
        this.session = session;
        this.commandID = 521
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
        this.GoldType = this.stream.readVInt()
        
    }

    async process() {
        const goldValues = {
            0: { Gold: 150, Gems: 20 },
            1: { Gold: 400, Gems: 50 },
            2: { Gold: 1200, Gems: 140 },
            3: { Gold: 2600, Gems: 280 }
        };
    
        const account = await database.getAccount(this.session.lowID);
        if(account.Gems-goldValues[this.GoldType] < 0){
            return new LoginFailedMessage(this.session, `Произошла ошибка 521. Перезайдите в игру`, 1).send();
        }else{
            const { Gold, Gems } = goldValues[this.GoldType] || { Gold: 100, Gems: 0 };

            account.Resources.Gems -= Gems
            account.Resources.Gold += Gold
            await database.replaceValue(account.lowID, 'Resources', account.Resources);
        }
    }
    
}

module.exports = LogicPurchaseHeroLvlUpMaterialCommand
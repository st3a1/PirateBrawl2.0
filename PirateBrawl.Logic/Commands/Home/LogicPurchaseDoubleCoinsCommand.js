const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const config = require("../../../config.json")
const LoginFailedMessage = require('../../Messages/Account/LoginFailedMessage')
const fs = require('fs');
class LogicPurchaseDoubleCoinsCommand extends PiranhaMessage{
    constructor(bytes, session){
        super(bytes)
        this.session = session;
        this.commandID = 509
        this.version = 0        
        this.stream = new ByteStream(bytes);
    }

    decode(self){
        // idk
    }

    async process(){
        const account = await database.getAccount(this.session.lowID)
        if(account.Gems-50 < 0){
            return new LoginFailedMessage(this.session, `Произошла ошибка 509. Перезайдите в игру`, 1).send();
        }else{
            account.Resources.TokensDoubler += 1000
            account.Resources.Gems -= 50
            await database.replaceValue(account.lowID, 'Resources', account.Resources);
        }
    }
    
    async getMessageType() {
        return 1337
    }

}


module.exports = LogicPurchaseDoubleCoinsCommand
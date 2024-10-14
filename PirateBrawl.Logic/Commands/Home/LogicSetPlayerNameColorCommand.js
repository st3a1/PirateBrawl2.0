const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const LoginFailedMessage = require('../../Messages/Account/LoginFailedMessage')
const config = require("../../../config.json")

const fs = require('fs').promises;
class LogicSetPlayerNameColorCommand extends PiranhaMessage{
    constructor(bytes, session){
        super(bytes)
        this.session = session;
        this.commandID = 527
        this.version = 0
        this.stream = new ByteStream(bytes)

    }

    decode(self){
        for (let i of Array(10).keys()){this.stream.readVInt()}   
        this.session.Namecolor = this.stream.readVInt()
    }
    
    async process() {
        if(this.session.Namecolor >= 12){
            const vipData = await fs.readFile('./PirateBrawl.Titan/JSON/vips.json', 'utf8');
            const vipParsed = JSON.parse(vipData);
            const foundItem = vipParsed.find(item => item.id === this.session.lowID);
            if(!foundItem) return new LoginFailedMessage(this.session, `У вас нету ${config.serverName} PREMIUM Купить через ТГ ${config.BotPREMIUM}`, 1).send();
        }
        await database.replaceValue(this.session.lowID, 'Namecolor', this.session.Namecolor);
    }
}

module.exports = LogicSetPlayerNameColorCommand
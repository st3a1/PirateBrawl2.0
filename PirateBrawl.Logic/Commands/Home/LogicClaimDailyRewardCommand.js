const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const Events = require('../../../PirateBrawl.Server/Utils/Events');

class LogicClaimDailyRewardCommand extends PiranhaMessage{
    constructor(bytes, session){
        super(bytes)
        this.session = session;
        this.commandID = 503
        this.version = 0        
        this.stream = new ByteStream(bytes);
    }

    decode(self){
        this.a1 = this.stream.readVInt()
        this.a2 = this.stream.readVInt()
        this.a3 = this.stream.readVInt()
        this.a4 = this.stream.readVInt()
        this.a5 = this.stream.readVInt()
        this.a6 = this.stream.readVInt()
        this.b1 = this.stream.readVInt()
        this.b2 = this.stream.readVInt()
        this.b3 = this.stream.readVInt()
        this.b4 = this.stream.readVInt()
    }

    async process(){
        const data = new Events().addTokenById(this.b4, this.session.lowID);
        const account = await database.getAccount(this.session.lowID)

        if(this.b4 == 7){
        account.Resources.Tickets = account.Resources.Tickets + data.reward;

        await database.replaceValue(this.session.lowID, 'Resources', account.Resources);
        }else{

		account.Resources.Box = account.Resources.Box + data.reward;

        await database.replaceValue(this.session.lowID, 'Resources', account.Resources);
        } 
    }}

module.exports = LogicClaimDailyRewardCommand
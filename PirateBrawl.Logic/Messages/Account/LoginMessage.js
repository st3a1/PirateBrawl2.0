const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
//Servers Packet
const LoginFailedMessage = require("./LoginFailedMessage")
const LoginOKMessage = require("./LoginOKMessage")
const OwnHomeDataMessage = require("../Home/OwnHomeDataMessage")
//database Calling
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const crypto = require('crypto');
const config = require("../../../config.json")
const Shop = require("../../../PirateBrawl.Server/Utils/Shop")
const MyAllianceMessage = require('../Alliance/MyAllianceMessage')
const AllianceStreamMessage = require('../Alliance/AllianceStreamMessage')

class LoginMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.id = 10101
    this.version = 0
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.stream.readInt()
    this.session.lowID = this.stream.readInt()
    this.session.token = this.stream.readString()

    this.major = this.stream.readInt()
    this.minor = this.stream.readInt()
    this.build = this.stream.readInt()
    this.fingerprint_sha = this.stream.readString() 
    this.DeviceModel = this.stream.readString()
    this.isAndroid = this.stream.readVInt()
  }

  isHashValid (checkHash) {
    const validHashes = "0c7901240f1c21eec1cef729d0d41f58b3a9b7f6|f557ffdd9cfc4e4d0e418108f33083e4|d8a6db135a566b8b07cd7dcf2fd233d94ba1e76b46b18d93d7e66f0242d595f7".split("|")
    const hash = checkHash.split("|")
    if (validHashes[0] === hash[0]) return true

    if (hash.length != validHashes.length) return false
    if (validHashes[0] != hash[0] || 
      validHashes[1] != hash[1] || 
      validHashes[2] != hash[2]) return false

    return true
  }

  async process () {

    const maintenceEndDate = new Date(config.maintenceEndTime);
    const now = new Date();
    const z = maintenceEndDate - now;
    const sectimer = Math.floor(z / 1000);

    if(config.maintence){
      await new LoginFailedMessage(this.session, ``, 10, sectimer).send()
      return;
    }
    if (!this.isHashValid(this.fingerprint_sha) || this.major !== config.major) {
      return await new LoginFailedMessage(this.session, `Отличные новости! Доступна новая версия ${config.serverName}Brawl\nGreat news! New version available ${config.serverName}Brawl`, 8).send();
    }

    if (!this.session.token) {
      this.session.token = crypto.randomBytes(Math.ceil(36/2)).toString('hex').slice(0, 36);
      await database.createAccount(this.session.token);
    }



    const account = await database.getAccountToken(this.session.token);
    if(account == null) return await new LoginFailedMessage(this.session, `Ваш аккаунт не найден, нужно удалить данные об игре!`, 18).send();
    
    //if (account.Shop.length === 0 || account.Shop[0].EndDate === undefined || Math.floor((new Date(account.Shop[0].EndDate) - new Date()) / 1000) <= 0) {
    //  account.Shop = new Shop().generateShop(account);
     // await database.replaceValue(account.lowID, 'Shop', account.Shop);
    //}

    if(account.Banned){
      await new LoginFailedMessage(this.session, ``, 13).send()
    }
  
    this.session.lowID = account.lowID;
    this.session.Resources = account.Resources;
	
    const unlockCardsArray = Object.values(global.UnlockCards);
    if (unlockCardsArray.length > account.Brawlers.length) {
        unlockCardsArray.forEach((card, i) => {
            if (!account.Brawlers.some(brawler => brawler.cardID === card)) {
                account.Brawlers.push({
                    id: i,
                    cardID: card,
                    unlocked: i === 0,
                    level: 0,
                    points: 0,
                    trophies: 0,
                    r10: false,
                    r15: false,
                    r20: false,
                    r25: false,
                    r30: false,
                    r35: false
                });
            }
        });
        await database.replaceValue(this.session.lowID, 'Brawlers', account.Brawlers);
    }
    
    await new LoginOKMessage(this.session).send();
    await new OwnHomeDataMessage(this.session, account).send();

    if (account.ClubID !== 0) {
      let gettingClub = await database.getClub(account.ClubID);
      if (gettingClub === null) return await database.replaceValue(this.session.lowID, 'ClubID', 0);
      if (!gettingClub.members.includes(this.session.lowID)) return await database.replaceValue(this.session.lowID, 'ClubID', 0);

      this.session.ClubRole = account.ClubRole;
      this.session.ClubID = account.ClubID;
      await new MyAllianceMessage(this.session, gettingClub, false).send();
      await new AllianceStreamMessage(this.session, gettingClub.msg).send()
    }
    console.log(this.session.Country)
  }
}

module.exports = LoginMessage
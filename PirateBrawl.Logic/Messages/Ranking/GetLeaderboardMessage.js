const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")
const LeaderboardMessage = require('./LeaderboardMessage');

class GetLeaderboardMessage extends PiranhaMessage {
  constructor(bytes, session) {
    super(session);
    this.session = session;
    this.id = 14403;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode() {
    this.a = this.stream.readVInt();
    this.type = this.stream.readVInt(); // 2 club // 1 total trop // 0 brawler
    this.idk = this.stream.readVInt();
    this.brawler = this.stream.readVInt();
  }

  async process() {
    switch (this.type) {
      case 1:
        await this.processTotalTrophies();
        break;
      case 0:
        await this.processBrawler();
        break;
      case 2:
        await this.processClub();
        break;
      default:
        console.error('Unknown leaderboard type:', this.type);
    }
  }
  async processTotalTrophies() {
    const leaders = await database.getLeaders();
    new LeaderboardMessage(this.session, this.brawler, this.type, leaders).send();
  }

  async processBrawler() {
    const leaders = await database.getGlobalBrawlerLeaders(this.brawler);
    new LeaderboardMessage(this.session, this.brawler, this.type, leaders).send();
  }

  async processClub() {
    const leaders = await database.getClubLeaders();
    new LeaderboardMessage(this.session, this.brawler, this.type, leaders).send();
  }
}

module.exports = GetLeaderboardMessage;

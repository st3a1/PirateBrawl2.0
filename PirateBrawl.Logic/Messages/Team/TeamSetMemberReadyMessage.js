const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const database = require("../../../PirateBrawl.Server/Database/DatabaseManager")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../../PirateBrawl.Server/Utils/Gameroom');

const TeamGameStartingMessage = require('./TeamGameStartingMessage');
const MatchMakingStatusMessage = require('../Battle/MatchMakingStatusMessage');
const GameMatchmakingManager = require('../../Laser.Logic/GameMatchmakingManager');


class TeamSetMemberReadyMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14355;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.bool = this.stream.readBoolean();
  }

  async process () {
    const Instance = new Gameroom()
    const roomInfo = Instance.setPlayerReady(this.session.roomID, this.session.lowID, this.bool);
    if (roomInfo !== null){
      for (const ids of roomInfo.players) {
        new TeamMessage(this.session, roomInfo).sendLowID(ids.lowID)
      }
      let submited = 0
      for (const ids of roomInfo.players) {
        if (ids.ready) submited += 1;
      }
      if(submited == roomInfo.players.length){
        for (const ids of roomInfo.players) {
          new TeamGameStartingMessage(this.session, roomInfo.mapID).sendLowID(ids.lowID)
          GameMatchmakingManager.Enqueue(this.session, roomInfo.mapSlot);
        }
      }
    }
  }
}
module.exports = TeamSetMemberReadyMessage;

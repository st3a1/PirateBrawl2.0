const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")
const MatchMakingCancelledMessage = require('./MatchMakingCancelledMessage');
const mm = require('./MatchMakingStatusMessage');
//const Gameroom = require('../../Laser.Server/Gameroom');
//const d = new Gameroom();

class CancelMatchmakingMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session)
    this.session = session
    this.id = 14106
    this.version = 0
    this.stream = new ByteStream(bytes)
  }

  async decode () {
    //
  }

  async process () {
    /*if(this.session.roomID > 0){
      const room = d.getRoomById(this.session.roomID);
      room.players.forEach(e => {
          d.setPlayerReady(this.session.roomID, e.lowID, false)
          this.session.inMatchmaking = false;
          new MatchMakingCancelledMessage(this.session).sendLowID(e.lowID);
      });
    }else{
    */
      this.session.inMatchmaking = false;
      if (global.players != 0) {
      global.players -= 1
      }
      console.warn(global.players)
      new MatchMakingCancelledMessage(this.session).send();
    //}
  }
}

module.exports = CancelMatchmakingMessage

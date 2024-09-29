const PiranhaMessage = require('../../../PirateBrawl.Titan/Message/PiranhaMessage')
const ByteStream = require("../../../PirateBrawl.Titan/Datastream/ByteStream")

const TeamMessage = require('./TeamMessage');
const Gameroom = require('../../../PirateBrawl.Server/Utils/Gameroom');

const Events = require('../../../PirateBrawl.Server/Utils/Events');
const EventsInstance = new Events();
class TeamSetEventMessage extends PiranhaMessage {
  constructor (bytes, session) {
    super(session);
    this.session = session;
    this.id = 14362;
    this.version = 0;
    this.stream = new ByteStream(bytes);
  }

  async decode () {
    this.Unknown1 = this.stream.readVInt();
    this.mapID = this.stream.readVInt();
  }

  async process () {
    const eventID = EventsInstance.getIdBySlotID(this.Unknown1)
    const mapData = [this.Unknown1, eventID]
    const Instance = new Gameroom()
    const roomInfo = Instance.ReplaceMapSlot(this.session.roomID, mapData);
    if (roomInfo !== null){
      for (const ids of roomInfo.players) {
        new TeamMessage(this.session, roomInfo).sendLowID(ids.lowID)
      }
	  }
  }
}
module.exports = TeamSetEventMessage;

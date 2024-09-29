class Gameroom {
  static rooms = new Map();

  create(roomData, plrData) {
    const newRoom = {
      id: Gameroom.rooms.size + 1,
      mapSlot: roomData.mapSlot,
      mapID: roomData.mapID,
      roomType: roomData.roomType,
      Tick: 1,
      premade: [],
      msg: [],
      invites: [],
      players: [plrData],
    };
    newRoom.msg.push(roomData.msg);
    Gameroom.rooms.set(newRoom.id, newRoom);
    return newRoom;
  }

  roomJoin(roomID, plrData, messageData) {
    const room = this.getRoomById(roomID);
    if (!room) return false;
    if (room && room.players.length <= 2) {
      room.Tick += 1;
      messageData.Tick = room.Tick;
      room.msg.push(messageData);
      room.players.push(plrData);
      return room;
    }
    return false;
  }

  getRoomById(roomID) {
    for (const room of Gameroom.rooms.values()) {
        if (room.id === roomID) {
            return room;
        }
    }
    return null;
}


  leaveRoom(roomID, plrID, messageData) {
    const room = this.getRoomById(roomID);
    if (!room) return [];

    const playerIndex = room.players.findIndex(player => player.lowID === plrID);
    if (playerIndex === -1) return [];

    room.players.splice(playerIndex, 1);
    room.Tick++;
    messageData.Tick = room.Tick;
    room.msg.push(messageData);

    return room;
  }

  ReplaceStatusPlayer(roomID, plrID, newStatus) {
      const room = this.getRoomById(roomID);
      if (!room || !Array.isArray(room.players)) return room;

      const player = room.players.find(player => player.lowID === plrID);
      if (!player) return room;

      player.status = newStatus;
      return room;
  }

  ReplaceMapSlot(roomID, mapData) {
      const room = this.getRoomById(roomID);
      if (!room) return room;

      room.mapSlot = mapData[0];
      room.mapID = mapData[1];
      return room;
  }

  addInvite(roomID, lowID, state, Name) {
      const room = this.getRoomById(roomID);
      if (!room) return false;

      room.invites.push({ lowID, Name, state });
      return room;
  }

  setPlayerReady(roomID, plrID, bool) {

      const room = this.getRoomById(roomID);
      if (!room) return false;

      const player = room.players.find(player => player.lowID === plrID);
      if (!player) return room;

      player.ready = bool;
      return room;
  }

  addMessage(roomID, messageData) {
      const room = this.getRoomById(roomID);
      if (!room) return false;

      room.Tick++;
      messageData.Tick = room.Tick;
      room.msg.push(messageData);
      return room;
  }

  addpremade(roomID, messageData) {
      const room = this.getRoomById(roomID);
      if (!room) return false;

      const { senderID, senderName, MessageDataID, TargetID, Unknown1, Unknown2 } = messageData;
      room.Tick++;
      room.premade.push({ Tick: room.Tick, senderID, senderName, MessageDataID, TargetID, Unknown1, Unknown2 });
      return true;
  }

  getRooms() {
    return Array.from(Gameroom.rooms.values());
}

  ReplaceRoomPlayer(roomID, plrID, BID, SID, BTR, BLV) {
      const room = this.getRoomById(roomID);
      if (!room) return false;

      const player = room.players.find(player => player.id === plrID);
      if (!player) return false;

      player.BID = BID;
      player.SID = SID;
      player.BTR = BTR;
      player.BLV = BLV;
      return true;
  }
  removeInvite(roomID, lowID) {
    const room = this.getRoomById(roomID);
    if (!room) return false;

    const index = room.invites.findIndex(invite => invite.lowID === lowID);
    if (index === -1) return false;

    room.invites.splice(index, 1);
    return true;
  }
  changePlayerFighter(roomID, playerLowID, newSkinID, brawler) {
    const room = this.getRoomById(roomID);
    if (!room) return null;

    const player = room.players.find(plr => plr.lowID === playerLowID);
    if (!player) return null;

    player.brawler = brawler;
    player.BrawlerID = brawler.id;
    player.SkinID = newSkinID;

    return room;
  }
}

module.exports = Gameroom;

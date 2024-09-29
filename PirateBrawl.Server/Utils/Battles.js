
class Battles {
    search(mapSlot, mapID, plrData) {
      const existingRoom = Array.from(global.Battles.values()).find(b => b.mapSlot === mapSlot);
      if (existingRoom) {
        if (existingRoom.players.length < existingRoom.maxPlayers) {
            plrData.team = existingRoom.players.length % 2;
            plrData.index = existingRoom.players.length + 1;
            existingRoom.players.push(plrData);
            return existingRoom.id;
        }
      }
      plrData.team = 0;
      plrData.index = 0;
      const battle = {
        id: global.Battles.size + 1,
        mapSlot: mapSlot,
        mapID: mapID,
        maxPlayers: 1,//mapSlot === 0 ? 6 : (mapSlot === 2 ? 10 : 6)
        Tick: 1,
        GameObjects: [],
        players: [plrData],
      };
      global.Battles.set(battle.id, battle);
      return battle;
    }
  
    getSelection(id) {
      return global.Battles.get(id);
    }
  
    removePlayer(roomId, playerId) {
      const room = global.Battles.get(roomId);
      if (room) {
        room.players = room.players.filter(player => player.lowID !== playerId);
        if (room.players.length === 0) {
          global.Battles.delete(roomId);
        }
      }
    }
  }
  
  module.exports = Battles;
  
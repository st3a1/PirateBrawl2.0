const config = require("../../config.json");
const BattleEndMessage = require("../../PirateBrawl.Logic/Messages/Battle/BattleEndMessage");

class Events {
    static eventarray = [
      {
        reward: 20,
        slotid: 1,
        id: 0,
        timer: 3600,
        Ended: false,
        TextEntry: null,
        tokensclaimed: []
      },
      {
        reward: 20,
        slotid: 2,
        id: 0,
        timer: 3600,
        Ended: false,
        TextEntry: null,
        tokensclaimed: []
      },
      {
        reward: 20,
        slotid: 3,
        id: 0,
        timer: 3600,
        Ended: false,
        TextEntry: null,
        tokensclaimed: []
      },
      {
        reward: 20,
        slotid: 4,
        id: 0,
        timer: 3600,
        Ended: false,
        TextEntry: null,
        tokensclaimed: []
      },
      {
        reward: 20,
        slotid: 5,
        id: 0,
        timer: 3600,
        Ended: false,
        TextEntry: null,
        tokensclaimed: []
      },
      {
        reward: 20,
        slotid: 7,
        id: config.SpecialEventID,
        timer: 3600,
        Ended: false,
        TextEntry: null,
        tokensclaimed: []
      },
      {
        reward: 20,
        slotid: 6,
        id: 0,
        timer: 3600,
        Ended: false,
        TextEntry: null,
        tokensclaimed: []
      },
      {
        reward: 20,
        slotid: 8,
        id: 0,
        timer: 3600,
        Ended: false,
        TextEntry: null,
        tokensclaimed: []
      }
    ];
  
    getAllEvents() {
      return Events.eventarray;
    }
  
    addTokenById(slotID, id) {
      const event = Events.eventarray.find((e) => e.slotid === slotID);
      if (event) {
        event.tokensclaimed.push(id);
        return event;
      }
      return false;
    }
  
    getIdBySlotID(slotID) {
      const event = Events.eventarray.find((e) => e.slotid === slotID);
      if (event) {
        return event.id;
      }
      return 7;
    }
    static getRandomGameMode(gameModesArray) {
      return gameModesArray[Math.floor(Math.random() * gameModesArray.length)];
    }
  
    update() {
      Events.eventarray.forEach((event) => {
        event.tokensclaimed = [];
        switch (event.slotid) {
          case 1:
            event.id = Events.getRandomGameMode(global.gameModes.CoinRush).id;
            break;
          case 2:
            const RandomGameMode2 = Events.getRandomGameMode(global.gameModes.BattleRoyale);
            event.id = RandomGameMode2.id;
            event.AllowedMaps = RandomGameMode2.AllowedMaps;
            break;
          case 3:
            event.id = Events.getRandomGameMode(global.gameModes.LaserBall).id;
            break;
          case 4:
            event.id = Events.getRandomGameMode(global.gameModes.BountyHunter).id;
            break; 
          case 5:
            const onlyshd = Events.eventarray.find((e) => e.slotid === 2)
            const matchingMode = global.gameModes.BattleRoyaleTeam.find(mode => mode.AllowedMaps === onlyshd.AllowedMaps);
            event.id = matchingMode.id;
            break
          case 7: 
            break
          case 8:
            const Random = Math.floor(Math.random() * 2);
            if(Random === 1){
            console.log("выбрали лонестар")
            event.id = Events.getRandomGameMode([174,175,176,177,178,179,180])
            }else{
            console.log("вырали такедаун")
            event.id = Events.getRandomGameMode([167, 173, 168, 169, 170, 172, 171])
            }
            break
          case 6:
            event.id = Events.getRandomGameMode([202,203,204,205,206,207,208])
            break
          default:
            // handle unexpected slotid
            break;
        }
      });
    }
  }
  
  module.exports = Events;
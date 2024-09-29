const Entry = require('../Home/Entry');
const Entrys = new Entry();

class Friend {
    constructor() {
    }
    async encode(stream, friend, currentTime, friendLastOnline) {
        stream.writeInt(0)// HighID
        stream.writeInt(friend.lowID)// LowID

        stream.writeString(null)
        stream.writeString(null)
        stream.writeString(null)
        stream.writeString(null)
        stream.writeString(null)
        stream.writeString(null)

        stream.writeInt(friend.Trophies)  //Trophies
        stream.writeInt(friend.FRSTATE)//3-Invite,4-In FriendList,
        stream.writeInt(0)
        stream.writeInt(0)
        stream.writeInt(0)

        stream.writeBoolean(false) // Alliance entry

        stream.writeString(null)

        const f = new Date(friend.lastOnline);
        if(isNaN(f.getTime())){
          stream.writeVInt(3600);
        }else{
          stream.writeInt((new Date() - f / 1000 > 30) ? f.getSeconds()*1000 : 0);
        }

        
        stream.writeBoolean(true)// ?? is a player?
        Entrys.PlayerDisplayData(stream, friend.Name, friend.Thumbnail, friend.Namecolor);

    }
  }
  
module.exports = Friend;
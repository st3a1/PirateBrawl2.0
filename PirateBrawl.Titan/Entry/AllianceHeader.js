class Alliance {
  constructor() {}
  encode(stream, club) {
    stream.writeInt(0);
    stream.writeInt(club.clubID);
    stream.writeString(club.Name);
    
    stream.writeDataReference(8, club.BadgeID); // BadgeID type
    stream.writeVInt(club.data.Type); // Club badge number
    stream.writeVInt(club.members.length || 0); // Club badge number
    
    stream.writeVInt(club.Trophies); // Club badge number
    stream.writeVInt(club.data.Trophiesneeded);
    
    stream.writeVInt(0);
    stream.writeString("BY");
    stream.writeVInt(0);
  }
}

module.exports = Alliance;
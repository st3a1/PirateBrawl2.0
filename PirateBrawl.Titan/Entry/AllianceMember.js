const Entry = require('./Entry');
class AllianceMember {
  constructor() {}
  ['encode'](c, d, e) {
    c.writeInt(0x0);
    c.writeInt(d.lowID);
    c.writeVInt(d.ClubRole);
    c.writeVInt(d.Trophies);
    const f = new Date(d.lastOnline);
    if(isNaN(f.getTime())){
      c.writeVInt(0);
      c.writeVInt(3600);
    }else{
      c.writeVInt(((new Date() - f) / 1000 > 30) ? 0 : d.Status);
      c.writeVInt(((new Date() - f) / 1000 > 30) ? (new Date() - f)/1000 : 0);
    }
    c.writeVInt(0x0);
    new Entry().PlayerDisplayData(c, d.Name, d.Thumbnail, d.Namecolor);
  }
}
module.exports = AllianceMember;
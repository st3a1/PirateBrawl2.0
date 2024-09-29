const AllianceMember = require("./AllianceMember");
const AllianceHeader = require("./AllianceHeader");
class Alliance {
  constructor() {}
  ["encode"](c, d, e) {
    const f = new Date();
    new AllianceHeader().encode(c, d);
    c.writeString(d.data.Description);
    c.writeVInt(e.length);
    e.forEach(g => {
      new AllianceMember().encode(c, g, f);
    });
  }
}
module.exports = Alliance;
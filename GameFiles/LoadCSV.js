const parse = require("./CSVParser")

function loadCSV() {
    global.LoadedCSV = 0;

    global.skins = [];
    global.gameModes = require("./locations").getAllMaps();
    global.Characters = require("./Characters")
    global.milestones = parse("./GameFiles/csv_logic/milestones.csv");
    global.Cards = require("./Cards")
    global.ListAwards = require("./milestones").GetListAwards();

    var skinsdata = parse("./GameFiles/csv_logic/skins.csv");

    skinsdata.filter(fr => fr.CostGems !== '').forEach(e => {
      global.skins.push({id:skinsdata.indexOf(e), cost:parseInt(e.CostGems)})
    });
    global.UnlockCards = global.Cards.getBrawlersUnlocks();
    global.skills = global.Cards.getAllSkills(0x4);
    console.log("LoadedCSV:", global.LoadedCSV);
}

module.exports = {
    loadCSV
}

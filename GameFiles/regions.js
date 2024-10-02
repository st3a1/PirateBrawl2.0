const parse = require('./CSVParser');
const regionsData = parse('./GameFiles/csv_logic/regions.csv');

function getregion(num) {
    if (num >= 0 && num < regionsData.length) {
        return regionsData[num]['Name'];  
    } else {
        console.warn(`[REGIONS] ${num} not found`);
        return null;
    }
}

module.exports = getregion;
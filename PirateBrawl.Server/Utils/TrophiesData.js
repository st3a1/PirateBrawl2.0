function GetQuantityFromLevel(AllLevels,AllQuantities,ThisLevel){
    return AllQuantities[AllLevels.indexOf(ThisLevel)]
}

function calculateShowdown(trophies, rank) {
    const trophyRanges = [
        { "min": 0, "max": 49, "rewards": [30, 28, 26, 18, 16, 12, 12, 8, 4, 2] },
        { "min": 50, "max": 99, "rewards": [30, 28, 26, 18, 14, 10, 10, 6, 2, 0] },
        { "min": 100, "max": 199, "rewards": [30, 28, 26, 18, 12, 8, 4, 2, 0, -2] },
        { "min": 200, "max": 299, "rewards": [28, 26, 24, 16, 10, 6, 2, 0, -2, -4] },
        { "min": 300, "max": 399, "rewards": [28, 26, 24, 16, 8, 4, 0, -2, -4, -6] },
        { "min": 400, "max": 499, "rewards": [28, 26, 24, 14, 6, 2, 0, -4, -6, -8] },
        { "min": 500, "max": 599, "rewards": [28, 26, 24, 14, 6, 0, -2, -6, -8, -10] },
        { "min": 600, "max": 699, "rewards": [26, 24, 22, 12, 4, -2, -4, -6, -8, -10] },
        { "min": 700, "max": 799, "rewards": [26, 24, 22, 12, 2, -4, -6, -8, -10, -12] },
        { "min": 800, "max": 899, "rewards": [24, 22, 20, 10, 0, -4, -6, -8, -10, -12] },
        { "min": 900, "max": 999, "rewards": [24, 22, 20, 8, -2, -6, -8, -10, -12, -14] },
        { "min": 1000, "max": 1099, "rewards": [22, 20, 18, 6, -4, -8, -10, -12, -14, -16] },
        { "min": 1100, "max": 1199, "rewards": [22, 20, 18, 4, -4, -8, -10, -12, -14, -16] },
        { "min": 1200, "max": Infinity, "rewards": [20, 18, 16, 2, -6, -10, -12, -14, -16, -18] }
    ];
    const currentRange = trophyRanges.find(range => trophies >= range.min && trophies <= range.max);
    return currentRange ? GetQuantityFromLevel([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], currentRange.rewards, rank) : 0;
}
function calculateGemGrab(trophies, win2lose) {
    const trophyRanges = [
        { "min": 0, "max": 49, "rewards": [30, 0] },
        { "min": 50, "max": 99, "rewards": [30, -1] },
        { "min": 100, "max": 199, "rewards": [30, -2] },
        { "min": 200, "max": 299, "rewards": [30, -3] },
        { "min": 300, "max": 399, "rewards": [30, -4] },
        { "min": 400, "max": 499, "rewards": [30, -5] },
        { "min": 500, "max": 599, "rewards": [30, -6] },
        { "min": 600, "max": 699, "rewards": [30, -7] },
        { "min": 700, "max": 799, "rewards": [30, -8] },
        { "min": 800, "max": 899, "rewards": [29, -9] },
        { "min": 900, "max": 999, "rewards": [28, -10] },
        { "min": 1000, "max": 1099, "rewards": [26, -10] },
        { "min": 1100, "max": 1199, "rewards": [26, -10] },
        { "min": 1200, "max": Infinity, "rewards": [26, -10] }
    ];
    const currentRange = trophyRanges.find(range => trophies >= range.min && trophies <= range.max);
    return currentRange ? GetQuantityFromLevel([0,1], currentRange.rewards, win2lose) : 0;
}
function calculateDuoShowdown(trophies, rank) {
    const trophyRanges = [
        { "min": 0, "max": 49, "rewards": [30, 28, 10, 0, 0] },
        { "min": 50, "max": 99, "rewards": [30, 28, 10, 0, -2] },
        { "min": 100, "max": 199, "rewards": [30, 28, 8, -2, -4] },
        { "min": 200, "max": 299, "rewards": [30, 28, 6, -4, -6] },
        { "min": 300, "max": 399, "rewards": [30, 28, 4, -6, -8] },
        { "min": 400, "max": 499, "rewards": [30, 28, 2, -8, -10] },
        { "min": 500, "max": 599, "rewards": [30, 28, 2, -10, -12] },
        { "min": 600, "max": 699, "rewards": [30, 28, 0, -10, -12] },
        { "min": 700, "max": 799, "rewards": [30, 28, 0, -10, -12] },
        { "min": 800, "max": 899, "rewards": [28, 26, -2, -10, -12] },
        { "min": 900, "max": 999, "rewards": [28, 26, -4, -10, -12] },
        { "min": 1000, "max": 1099, "rewards": [26, 24, -6, -10, -12] },
        { "min": 1100, "max": 1199, "rewards": [24, 22, -8, -10, -12] },
        { "min": 1200, "max": Infinity, "rewards": [22, 20, -8, -10, -12] }
    ];
    const currentRange = trophyRanges.find(range => trophies >= range.min && trophies <= range.max);
    return currentRange ? GetQuantityFromLevel([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], currentRange.rewards, rank) : 0;
}
module.exports = {
    calculateShowdown,
    calculateDuoShowdown,
    calculateGemGrab
};
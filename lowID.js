const { hasMagic } = require('glob');
const readline = require('readline');

function getId(Hashtag) {
  const TagChar = ["0", "2", "8", "9", "P", "Y", "L", "Q", "G", "R", "J", "C", "U", "V"];
  if (!Hashtag.startsWith('#')) {
    Hashtag = '#'+Hashtag
  }

  const TagArray = Hashtag.slice(1).toUpperCase().split('');
  let Id = 0;

  for (let i = 0; i < TagArray.length; i++) {
    const Character = TagArray[i];

    try {
      const CharIndex = TagChar.indexOf(Character);
      if (CharIndex === -1) {
        throw new Error();
      }
      Id *= TagChar.length;
      Id += CharIndex;
    } catch (error) {
      return [0,0]
    }
  }

  return Id;
}

function getHLid(Hashtag) {
  const TagChar = ["0", "2", "8", "9", "P", "Y", "L", "Q", "G", "R", "J", "C", "U", "V"];
  if (!Hashtag.startsWith('#')) {
    Hashtag = '#'+Hashtag
  }

  const TagArray = Hashtag.slice(1).toUpperCase().split('');
  let Id = 0;

  for (let i = 0; i < TagArray.length; i++) {
    const Character = TagArray[i];

    try {
      const CharIndex = TagChar.indexOf(Character);
      if (CharIndex === -1) {
        throw new Error();
      }
      Id *= TagChar.length;
      Id += CharIndex;
    } catch (error) {
      return [0,0]
    }
  }

  const HighLow = [];
  HighLow.push(Id % 256);
  HighLow.push((Id - HighLow[0]) >> 8);

  return HighLow;
}

function processHashtag(Hashtag) {
  if (!Hashtag.startsWith('#')) {
    Hashtag = '#'+Hashtag
  }

  const HlId = getHLid(Hashtag);
  const ID = getId(Hashtag);

  return HlId[1]; // Add this line to return the processed ID
}

module.exports = processHashtag;
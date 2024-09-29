const mysql = require('mysql2/promise');

const cache = new Map();
const clubLeadersCache = new Map();
const globalBrawlerLeadersCache = new Map();
const clubListCache = new Map();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Demon228For!',
  database: 'idk'
});

pool.execute(`CREATE TABLE IF NOT EXISTS clubs (
  clubID INT PRIMARY KEY AUTO_INCREMENT,
  members JSON,
  msg JSON,
  Trophies INT,
  Name TEXT,
  BadgeID TINYINT,
  data JSON
)`);

pool.execute(`CREATE TABLE IF NOT EXISTS accounts (
  lowID INT PRIMARY KEY AUTO_INCREMENT,
  token TEXT,
  Trophies INT,
  HightTrophies INT,
  TrophyRoadTier INT,
  Experience INT,
  Thumbnail TINYINT,
  Namecolor TINYINT,
  Resources JSON,
  BrawlerID TINYINT,
  SkinID INT,
  AuthorCode TEXT,
  Name TEXT,
  ClubID INT,
  ClubRole TINYINT,
  Status TINYINT,
  Shop JSON,
  Skins JSON,
  Notification JSON,
  Brawlers JSON,
  Skills JSON,
  lastGame TEXT,
  lastOnline TEXT,
  Friends JSON,
  Indicators JSON
)`);

pool.execute(`CREATE TABLE IF NOT EXISTS token_lowID (
  token TEXT,
  lowID INT,
  FOREIGN KEY (lowID) REFERENCES accounts(lowID)
)`);
async function createAccount(token) {
  try {
    const brawlersArray = getBrawlerArray();
    const [rows, fields] = await pool.execute(`INSERT INTO accounts (
      token, Trophies, HightTrophies, TrophyRoadTier, Experience, Thumbnail, Namecolor, Resources,
      BrawlerID, SkinID,AuthorCode, Name, ClubID, ClubRole, Status, Shop, Skins,
      Notification, Brawlers, Skills, lastGame, lastOnline, Friends, Indicators
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      token,
      0, // Trophies
      0, // HightTrophies
      1, // TrophyRoadTier
      490, // Experience
      3, // Thumbnail
      0, // Namecolor
      JSON.stringify({
        "TokensDoubler": 500,
        "Tickets": 0,
        "Starpoints": 0,
        "BigBox": 0,
        "Gold": 1000,
        "Box": 0,
        "Gems": 100
      }), // Resources,
      0, // BrawlerID
      0, // SkinID
      "", // AuthorCode
      "JSV19", // Name
      0, // ClubID
      1, // ClubRole
      0, // Status
      JSON.stringify([]), // Shop
      JSON.stringify([]), // Skins
      JSON.stringify([]), // Notification
      JSON.stringify(brawlersArray), // Brawlers
      JSON.stringify([]), // Skills
      "",//lastGame
      "",
      JSON.stringify([]), // Friends
      JSON.stringify({
        "TRIOWINS": 0,
        "SOLOWINS": 0,
        "DUOWINS": 0,
      })// Indicators
    ]);
    
    const newAccountId = rows.insertId;
    await pool.execute(`INSERT INTO token_lowID (token, lowID) VALUES (?, ?)`, [token, newAccountId]);
    return null;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

function getBrawlerArray() {
  const unlockCardsArray = Object.values(global.UnlockCards);
  return Array.from({ length: unlockCardsArray.length }, (_, i) => ({
      id: i,
      cardID: unlockCardsArray[i],
      unlocked: i === 0,
      level: 0,
      points: 0,
      trophies: 0
  }));
}

async function getAccount(lowID) {

  try {
    const [rows, fields] = await pool.execute('SELECT * FROM accounts WHERE lowID = ?', [lowID]);
    if (rows.length > 0) {
      let row = rows[0];
      let brawlerTrop = row.Brawlers.reduce((sum, brawler) => sum + parseInt(brawler.trophies), 0);
      if (brawlerTrop !== row.Trophies) {
        row.Trophies = brawlerTrop;
        await pool.execute('UPDATE accounts SET Trophies = ? WHERE lowID = ?', [row.Trophies, lowID]);
      }
      if(row.Trophies > row.HightTrophies){
        row.HightTrophies = row.Trophies;
        await pool.execute('UPDATE accounts SET HightTrophies = ? WHERE lowID = ?', [row.HightTrophies, lowID]);
      }

      return row;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading account:', error.message);
    throw error;
  }
}

async function getAccountToken(token) {
  const [rows, fields] = await pool.execute('SELECT * FROM token_lowID WHERE token = ?', [token]);
  if (rows.length > 0) { 
      let row = rows[0];
      return getAccount(row.lowID)
  } else {
      return null
  }
}


async function replaceValue(lowID, valueName, newValue) {
  try {
    if (valueName !== "Brawlers") {
      await pool.execute(`UPDATE accounts SET ${valueName} = ? WHERE lowID = ?`, [newValue, lowID]);

      if (valueName === 'token') {
        await pool.execute(`UPDATE token_lowID SET token = ? WHERE lowID = ?`, [newValue, lowID]);
      }
    } else {
      const brawlersString = JSON.stringify(newValue);
      await pool.execute(`UPDATE accounts SET Brawlers = ? WHERE lowID = ?`, [brawlersString, lowID]);
    }
  } catch (error) {
    console.error('Error updating value:', error.message);
    throw error;
  }
}

async function getLeaders() {
  const cacheKey = 'leaderboardData';
  const now = Date.now();
  try {
    if (cache.has(cacheKey)) {
      const { data, expiry } = cache.get(cacheKey);
      if (now < expiry) {
        return data;
      }
    }

    const sql = 'SELECT lowID, Trophies, Name, Thumbnail, Namecolor FROM accounts ORDER BY Trophies DESC LIMIT 200';
    const [rows] = await pool.execute(sql);

    const expiry = now + 7000;
    cache.set(cacheKey, { data: rows, expiry });

    return rows;
  } catch (error) {
    logToFile(`Error fetching leaderboard data: ${error}`);
    throw error;
  }
}

async function getGlobalBrawlerLeaders(BID) {
  const cacheKey = `globalBrawlerLeaders_${BID}`;
  const now = Date.now();
  try {
    if (globalBrawlerLeadersCache.has(cacheKey)) {
      const { data, expiry } = globalBrawlerLeadersCache.get(cacheKey);
      if (now < expiry) {
        return data;
      }
    }

    const query = `
    SELECT lowID, Name, Thumbnail, Namecolor, b.id as brawler_id, b.trophies as brawler_trophies
    FROM accounts a
    INNER JOIN JSON_TABLE(a.Brawlers, "$[*]" COLUMNS (
      id TINYINT PATH "$.id",
      trophies INT PATH "$.trophies"
    )) AS b
    WHERE b.id = ?
    ORDER BY b.trophies DESC
    LIMIT 200
    `;
    const [rows] = await pool.execute(query, [BID]);

    const leadersWithPlayerInfo = rows.map(row => ({
      lowID: row.lowID,
      Name: row.Name,
      Thumbnail: row.Thumbnail,
      Namecolor: row.Namecolor,
      brawler: {
        id: row.brawler_id,
        trophies: row.brawler_trophies
      }
    }));

    const expiry = now + 10000;
    globalBrawlerLeadersCache.set(cacheKey, { data: leadersWithPlayerInfo, expiry });
    
    return leadersWithPlayerInfo;
  } catch (error) {
    const errorMessage = `Error getting global Brawler leaders with player info: ${error.message}`;
    logToFile(errorMessage);
    throw error;
  }
}


async function getClubLeaders() {
  const cacheKey = 'clubLeadersData';
  const now = Date.now();
  try {
    if (clubLeadersCache.has(cacheKey)) {
      const { data, expiry } = clubLeadersCache.get(cacheKey);
      if (now < expiry) {
        return data;
      }
    }

    const [rows] = await pool.execute('SELECT clubID, Trophies, Name, members, BadgeID FROM clubs ORDER BY Trophies DESC LIMIT 100');

    const expiry = now + 60000;
    clubLeadersCache.set(cacheKey, { data: rows, expiry });
    
    return rows;
  } catch (error) {
    const errorMessage = `Error getting club leaders: ${error.message}`;
    logToFile(errorMessage);
    throw error;
  }
}


async function getClubList() {
  const cacheKey = 'clubListData';
  const now = Date.now();

  try {
    if (clubListCache.has(cacheKey)) {
      const { data, expiry } = clubListCache.get(cacheKey);
      if (now < expiry) {
        return data;
      }
    }

    const [rows, fields] = await pool.execute('SELECT clubID, Trophies, Name, members, BadgeID FROM clubs ORDER BY RAND() LIMIT 100');

    const expiry = now + 10000;
    clubListCache.set(cacheKey, { data: rows, expiry });
    
    return rows;
  } catch (error) {
    const errorMessage = `Error getting club list: ${error.message}`;
    logToFile(errorMessage);
    throw error;
  }
}

async function searchClub(Name) {
  try {
    const [clubRows] = await pool.execute('SELECT * FROM clubs WHERE Name = ?', [Name]);

    const clubs = clubRows.map(club => {
      return club;
    });
    return clubs;
  } catch (error) {
    console.error('Error searching for clubs:', error.message);
    throw error;
  }
}

async function createClub(data) {
  try {
    const [result] = await pool.execute('INSERT INTO clubs (members, msg, Trophies, Name, BadgeID, data) VALUES (?, ?, ?, ?, ?, ?)', [
      JSON.stringify(data.members),
      JSON.stringify([]),
      data.Trophies,
      data.Name,
      data.BadgeID,
      JSON.stringify({
        Type: data.Type,
        Trophiesneeded: data.Trophiesneeded,
        Description: data.Description,
        FriendlyFamily: data.FriendlyFamily
      })
    ]);

    return result.insertId;
  } catch (error) {
    console.error('Error creating club:', error.message);
    throw error;
  }
}

async function getClub(clubID) {
  try {
    const [rows, fields] = await pool.execute('SELECT clubID, members, Name, BadgeID, msg, data FROM clubs WHERE clubID = ?', [clubID]);
    if (rows.length > 0) {
      const club = rows[0];
      
      let clubTrophies = 0;
	  
      let messages = club.msg.sort((a, b) => b.tick - a.tick);
      
      if (messages.length > 30) {
        club.msg = messages.slice(0, 30);
      }
      club.msg = club.msg.sort((a, b) => a.tick - b.tick);

      for (let plrID of club.members) {
        const player = await getAccount(plrID);
        if (player.Brawlers.length <= 0) await clubDelMember(club.members, clubID, player.lowID);
        if (player.ClubID !== clubID) await clubDelMember(club.members, clubID, player.lowID);
        clubTrophies += player.Trophies;
      }
      if (club.Trophies !== clubTrophies) {
        club.Trophies = clubTrophies;
        await pool.execute('UPDATE clubs SET Trophies = ? WHERE clubID = ?', [clubTrophies, clubID]);
      }
      return club;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting club:', error.message);
    throw error;
  }
}

async function getUserClub(lowID) {
  try {
    const [rows, fields] = await pool.execute('SELECT lowID, ClubRole, Trophies, lastOnline, Status, Name, Thumbnail, Namecolor, Brawlers FROM accounts WHERE lowID = ?', [lowID]);
    if (rows.length > 0) {
      let row = rows[0];
      let brawlerTrop = row.Brawlers.reduce((sum, brawler) => sum + parseInt(brawler.trophies), 0);
      if(brawlerTrop !== row.Trophies){
        row.Trophies = brawlerTrop
        await pool.execute('UPDATE accounts SET Trophies = ? WHERE lowID = ?', [row.Trophies, lowID]);
      }
      return row;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading account:', error.message);
    throw error;
  }
}

async function clubUpdate(clubID, settings) {
  try {
    const [clubRows] = await pool.execute('SELECT * FROM clubs WHERE clubID = ?', [clubID]);
    if (!clubRows.length) {
      throw new Error(`Club with ID ${clubID} not found`);
    }

    const club = clubRows[0];
    const updatedClub = {
      ...club,
      Name: settings.Name || club.Name,
      BadgeID: settings.BadgeID || club.BadgeID,
      data: {
        Type: settings.Type || club.data.Type,
        Description: settings.Description || club.data.Description,
        Trophiesneeded: settings.Trophiesneeded || club.data.Trophiesneeded,
        FriendlyFamily: settings.FriendlyFamily || club.data.FriendlyFamily
      }
    };

    await pool.execute('UPDATE clubs SET Name = ?, BadgeID = ?, data = ? WHERE clubID = ?', [
      updatedClub.Name,
      updatedClub.BadgeID,
      updatedClub.data,
      clubID
    ]);
    return updatedClub
  } catch (error) {
    console.error('Error updating club settings:', error.message);
    throw error;
  }
}

async function clubAddMessages(messages, msgData, clubID) {
  try {
    messages.push({
      timestamp: new Date(),
      tick: messages.length + 1,
      ...msgData,
    });
    messages = messages.sort((a, b) => b.tick - a.tick);

    if (messages.length > 30) {
      messages = messages.slice(0, 30);
    }

    messages = messages.sort((a, b) => a.tick - b.tick);
    await pool.execute('UPDATE clubs SET msg = ? WHERE clubID = ?', [JSON.stringify(messages), clubID]);
    return messages;
  } catch (error) {
    console.error('Error adding message to club:', error.message);
    throw error;
  }
}

async function clubDelMember(members, clubID, plrID) {
  try {
    const memberIndex = members.indexOf(plrID);
    if (memberIndex !== -1) {
      members.splice(memberIndex, 1);
      await pool.execute('UPDATE clubs SET members = ? WHERE clubID = ?', [JSON.stringify(members), clubID]);
      if (members.length === 0) {
        await pool.execute('DELETE FROM clubs WHERE clubID = ?', [clubID]);
      }
    }
  } catch (error) {
    console.error('Error removing player from club:', error.message);
    throw error;
  }
}

async function clubAddMember(members, lowID, clubID) {
  try {
    members.push(lowID)
    await pool.execute('UPDATE clubs SET members = ? WHERE clubID = ?', [JSON.stringify(members), clubID]);
    return members;
  } catch (error) {
    console.error('Error adding player to club:', error.message);
    throw error;
  }
}

async function getCounts() {
  try {
    const [accountRows, clubRows, DAU] = await Promise.all([
      pool.execute('SELECT COUNT(*) AS count FROM accounts'),
      pool.execute('SELECT COUNT(*) AS count FROM clubs'),
      pool.execute('SELECT COUNT(*) from accounts WHERE lastOnline >= CURRENT_TIME() - INTERVAL 1 DAY')
    ]);
    const accountCount = accountRows[0][0].count;
    const clubCount = clubRows[0][0].count;
    const infodau = DAU[0][0]['COUNT(*)'];

    return { accountCount, clubCount, infodau };
  } catch (error) {
    console.error('Error getting counts:', error.message);
    throw error;
  }
}

module.exports = {
  createAccount,
  getAccount,
  getAccountToken,
  replaceValue,
  getLeaders,
  getGlobalBrawlerLeaders,
  getClubLeaders,
  getClubList,
  searchClub,
  createClub,
  getClub,
  getUserClub,
  clubUpdate,
  clubAddMessages,
  clubDelMember,
  clubAddMember,
  getCounts
};
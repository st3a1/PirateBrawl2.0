const fs = require('fs').promises;
const { Telegraf, Markup } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const processHashtag = require('./lowID');
const config = require('./config.json');
var tgacc = require('./PirateBrawl.Titan/JSON/tgacc.json');
const vips = require('./PirateBrawl.Titan/JSON/vips.json');
const Authors = require("./PirateBrawl.Titan/JSON/Authors.json");

const database = require("./PirateBrawl.Server/Database/DatabaseManager");

const token = null;
const bot = new Telegraf(token);

const Shop = require("./PirateBrawl.Server/Utils/Shop");
const Gameroom = require('./PirateBrawl.Server/Utils/Gameroom');
const gameroomInstance = new Gameroom();

const session = new LocalSession({
    database: 'sessions.json',
    storage: LocalSession.storageFileAsync,
    format: {
      serialize: (obj) => JSON.stringify(obj, null, 2),
      deserialize: (str) => JSON.parse(str),
    },
});
  
bot.use(session.middleware());

bot.command('start', async (ctx) => {
    try {
        const message = await ctx.reply(`💫 | Добро пожаловать в бота для донатов [Mix Brawl](${"https://t.me/mixbrawlclose"})\n\nЗдесь ты сможешь купить донат и поддержать свой любимый сервер ${config.serverName}Brawl`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💰 Донат', callback_data: `DonateMenu` },{ text: '👥 Поддержка', callback_data: `Supports` }]
                ]
            }
        });
        ctx.session.MessageID = message.message_id;
    } catch (error) {
      config.admins.forEach(async e  => { await ctx.telegram.sendMessage(e, error);});
    }
});

bot.on('text', async (ctx) => {
    const messageText = ctx.message.text;
    const userId = ctx.message.from.id;
    const messageId = ctx.message.message_id;
    await ctx.deleteMessage(messageId);

    try {
        switch (true) {
			case (messageText.startsWith('/newAuthor')): {
			  if (!config.admins.includes(parseInt(userId))) return await ctx.reply('Нет прав! ' + userId);

				const info = messageText.split(' ');
				if (info.length < 2) return await ctx.reply(`Вы не указали тег!`);
				const playerId = processHashtag(info[1]);
				if (playerId === 0) return await ctx.reply(`Вы неправильно указали тег!`);
				if (info.length < 3) return await ctx.reply(`Вы не указали Код Автора!`);

				const authorCodeData = { CreatorID: parseInt(playerId), CodeName: info[2], Actived: [] };
				Authors.push(authorCodeData);
				vips.push({ id: parseInt(processHashtag(info[1])) });
				fs.writeFile('./Laser.Server/vips.json', JSON.stringify(vips, null, 2));
				fs.writeFile('./Laser.Server/Authors.json', JSON.stringify(Authors, null, 2));
				await ctx.reply('Успешно!');
				break;
			}
            case (ctx.session.ConnectAccount): {
                const commandParams = messageText.split(' ');
                
                const tag = commandParams[0];
                const regex = /[OoОо]/;
                
                if (regex.test(tag)){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`Тег содержит букву "O"!\nЗамени на цифру 0\n\nИсправь ошибки, отправь комманду сново!`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }
                const playerId = processHashtag(tag);

                if (playerId === 0){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`🔌 | Вы неправильно указали тег! [Как узнать свой тег?](${"https://telegra.ph/Gde-najti-TEG-igroka-10-15"})\n\nВам нужно написать свой тег. (пример: #2PP)`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }
                if (tgacc.find(acc => acc.lowID == playerId)){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`Данный аккаунт уже привязан!`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }


                const account = await database.getAccount(playerId)
                if(account === null){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`Данный аккаунт ненайден в базе!\nВозможно вы пропустили что-то...`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }
                ctx.session.plrID = playerId;

                account.Notification = account.Notification.filter(notification => !notification.text.startsWith('Вы начали привязку аккаунта.'));

                const newCode = Math.floor(Math.random() * 9999) + 1000;
                account.Notification.push({
                    ID: 81,
                    index: parseInt(account.Notification.length+1),
                    type: 0,
                    date: new Date(),
                    text: `Вы начали привязку аккаунта.\nВАШ КОД: ${newCode}`
                });
                
                await database.replaceValue(playerId, 'Notification', account.Notification);
                ctx.session.code = newCode;
                await ctx.telegram.editMessageText(
                    ctx.message.chat.id, ctx.session.MessageID, null,
                    `Привет ${account.Name}!\nКод авторизации пришел на ваш аккаунт.\nЗайди в игру и запомните код и отправьте:\n/code ВАШ КОД`,
                    {
                        reply_markup: {inline_keyboard: []},
                        parse_mode: 'Markdown' 
                    }
                );
                ctx.session.ConnectAccount = false
                break;
            }
            case (messageText.startsWith('/code')): {
                const commandParams = messageText.split(' ');
              
                if (commandParams.length < 2) return await ctx.reply(`Вы не указали код!`);
                
                const code = commandParams[1];
                if (ctx.session.code === parseInt(code)){
                    ctx.session.code = 0
                    const account = await database.getAccount(ctx.session.plrID);
                    account.Notification = account.Notification.filter(notification => !notification.text.startsWith('Вы начали привязку аккаунта.'));
                    account.Notification = account.Notification.filter(notification => !notification.text.startsWith('Ваш аккаунт привязан к TailerID'));
                    account.Notification.push({
                      ID: 94,
                      index: parseInt(account.Notification.length)+1,
                      reward: 59,
                      type: 29,
                      date: new Date(),
                      claim: false,
                      text: `Ваш аккаунт привязан к TailerID`
                    });
                    await database.replaceValue(ctx.session.plrID, 'Notification', account.Notification);
                    tgacc.push({id: userId,lowID: ctx.session.plrID})
                    await ctx.telegram.editMessageText(
                        ctx.message.chat.id, ctx.session.MessageID, null,
                        `✅ | Ваш Аккаунт был успешно привязан к TailerID!`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Вернуться в меню`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    ctx.session.plrID = 0;
                    fs.writeFile('./Laser.Server/tgacc.json', JSON.stringify(tgacc, null, 2), (err) => {if (err) {console.error('Ошибка сохранения файла с конфигурацией:', err)}});
                    break;
                }else{
                    await ctx.reply(`Вы неправильно ввели код!\nПопробуйте пройти привязку сново.`);
                    break;
                }
            }
            case (ctx.session.Tag2Recovery): {
                const tag = messageText;
                const regex = /[OoОо]/;
              
                if (regex.test(tag)){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`Тег содержит букву "O"!\nЗамени на цифру 0\n\nИсправь ошибки, отправь комманду сново!`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }                
                const playerId = processHashtag(tag);
        
                if (playerId === 0){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`🔌 | Вы неправильно указали тег! [Как узнать тег?](${"https://telegra.ph/Gde-najti-TEG-igroka-10-15"})`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }
                if(playerId === ctx.session.LowID2Recovery){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`🔌 | Вы должны создать новый аккаунт, и написать новый тег!`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }
                const newacc = await database.getAccount(playerId);
                const oldacc = await database.getAccount(ctx.session.LowID2Recovery);
      
                if(newacc.token === null) return await ctx.reply(`Произошла ошибка создайте новый аккаунт еще раз!`);
                await database.replaceValue(oldacc.lowID, 'token', newacc.token);
                await database.replaceValue(newacc.lowID, 'token', "");
                ctx.session.Tag2Recovery = false;
      
                ctx.session.LowID2Recovery = 0;
                await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`🔌 | Ваш аккаунт успешно вернули заходи в игру!`,
                    {
                        reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                        parse_mode: 'Markdown' 
                    }
                );
                break
            }
            case (ctx.session.enterTag): {
                const tag = messageText;
                const regex = /[OoОо]/;
              
                if (regex.test(tag)){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`Тег содержит букву "O"!\nЗамени на цифру 0\n\nИсправь ошибки, отправь комманду сново!`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }                
                const playerId = processHashtag(tag);
        
                if (playerId === 0){
                    await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`🔌 | Вы неправильно указали тег! [Как узнать тег?](${"https://telegra.ph/Gde-najti-TEG-igroka-10-15"})\n\nИсправь ошибки, отправь тег сново!`,
                        {
                            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                            parse_mode: 'Markdown' 
                        }
                    );
                    return;
                }
        
                ctx.session.enterTag = false;
                await ctx.telegram.editMessageText(ctx.message.chat.id, ctx.session.MessageID, null,`Для оплаты перейдите по [сыллке (ЖМИ СЮДА)](https://pay.cloudtips.ru/p/9d269722)\n\nУкажите сумму: ${ctx.session.cost}\nВ комментарии напишите свой тег: ${tag}\nПЕРЕВОДИТЕ ТОЧНУЮ СУММУ, ЕСЛИ ОШИБЕТЕСЬ В СУММЕ ТО МЫ ИМЕЕМ ПРАВО НЕ ВЫДАВАТЬ ТОВАР И РАСЦЕНИТЬ ОПЛАТУ КАК ПОДАРОК1`,
                    {
                        reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                        parse_mode: 'Markdown' 
                    }
                );
                break;
            }
            case (messageText.startsWith('/GetHelp')): {
                if (!config.admins.includes(parseInt(userId))) return await ctx.reply('Нет прав! ' + userId);
                await ctx.reply(
                    `/getID - Узнать lowID Игрока\n
                    /reward #2PP 170 - Выдать Игроку 170 кристаллов\n
                    /ResetAllShop - Сбросить всем магазин\n
                    /addAllShop | giveoffers - ну тут сохры\n
                    /delshop - Отчистить магазин игроку\n
                    /replace #2PP Box 100 - Выдать Игроку Ресы 'Gems','Box','Gold','BigBox','Starpoints','Tickets','TokensDoubler'\n
                    /vipADD #2PP - Выдать Випку\n
                    /ban #2PP - Выдать бан\n
                    /clubban #8GG NEW_NAME - Сменить имя клуба\n
                    /Statistics - Стата`
                );
                break;
            }
            case (messageText.startsWith('/getID')): {
                const info = messageText.split(' ');
                await ctx.reply(`Успешно! ${parseInt(processHashtag(info[1]))}`);
                break;
            }
            case (messageText.startsWith('/reward')): {
                if (!config.admins.includes(parseInt(userId))) return await ctx.reply('Нет прав! ' + userId);
              
                const commandParams = messageText.split(' ');
                if (commandParams.length !== 3)  return await ctx.reply('Недостаточно параметров.');
              
                const hashtag = commandParams[1];
                const value = commandParams[2];
      
                const returnedID = processHashtag(hashtag);
                if (returnedID === 0) return await ctx.reply('Букву О на цифру 0 да.');
              
                const account = await database.getAccount(parseInt(returnedID));
                if (account === null) return await ctx.reply('Аккаунт не найден!');
                
                account.Notification.push({
                  ID: 89,
                  index: account.Notification.length*2,
                  reward: value,
                  type: 0,
                  date: new Date(),
                  claim: false,
                  text: ``
                })
                
                await database.replaceValue(returnedID, 'Notification', account.Notification);
      
                await ctx.reply('Успешно!');
                break;
            }
            case (messageText.startsWith('/ResetAllShop')): {
                if(!config.admins.includes(parseInt(userId))){
                    await ctx.reply('Нет прав!' + userId);
                    break
                }
                await database.resetShop();
                await ctx.reply(`Успешно!`);
            }
            case (messageText.startsWith('/setback')): {
                if(!config.admins.includes(parseInt(userId))){
                    await ctx.reply('Нет прав!' + userId);
                    break
                }
				const commandParams = messageText.split(' ');
                const id = commandParams[1];
				if (commandParams.length !== 1) return await ctx.reply(`Доступный список фонов ${array}\n/setback 1`)

				const array = [0, 1, 2, 3, 5, 6, 7, 8, 11];
				
				if(!array.includes(id)) return await ctx.reply(`Доступный список фонов ${array}`);
				global.backgroundID = id;
                await ctx.reply(`Успешно!`);
            }
            case (messageText.startsWith('/addAllShop')): {
                if(!config.admins.includes(parseInt(userId))){
                  await ctx.reply('Нет прав!' + userId);
                  break
                }
                const commandParams = messageText.split(' ');
                const offerData = commandParams.slice(1).join(' ');
                await new Shop().giftAllPlayer(JSON.parse(offerData));
                await ctx.reply('Успешно!');
                break;
              }
              case (messageText.startsWith('/giveoffers')): {
                const commandParams = messageText.split(' ');
      
                if (commandParams.length < 3) return await ctx.reply('Комманда не найдена.')
      
                const hashtag = commandParams[1];
                const offerData = commandParams.slice(2).join(' ');
      
                const account = await database.getAccount(parseInt(processHashtag(hashtag)));
      
                if (!account) return await ctx.reply('Игрок не найден.')
      
                const OffersParsed = JSON.parse(offerData)
                const EndDate = new Date()
                EndDate.setDate(EndDate.getDate() + 1);
                EndDate.setHours(9, 0, 0, 0);
        
                OffersParsed.EndDate = EndDate;
                OffersParsed.claim = false;
      
                account.Shop.push(OffersParsed);
      
                await database.replaceValue(account.lowID, 'Shop', account.Shop);
      
                await ctx.reply('Новая акция успешно добавлена для игрока.');
                break;
            }
            case (messageText.startsWith('/delshop')): {
              if(!config.admins.includes(parseInt(userId))){
                await ctx.reply('Нет прав!' + userId);
                break
              }
              const commandParams = messageText.split(' ');
      
              if (commandParams.length < 2) {
                await ctx.reply('Недостаточно параметров.');
              }
              const playerId = processHashtag(commandParams[1]);
      
              await database.replaceValue(parseInt(playerId), 'Shop', []);
      
              await ctx.reply('Акции удалены!');
              break;
            }
            case (messageText.startsWith('/replace')): {
              if (!config.admins.includes(parseInt(userId))) {
                await ctx.reply('Нет прав!' + userId);
                break;
              }
            
              const commandParams = messageText.split(' ');
              if (commandParams.length !== 4) {
                await ctx.reply('Неверный формат команды');
                break;
              }
            
              const hashtag = commandParams[1];
              const resourceType = commandParams[2];
              const value = commandParams[3];
      
              const returnedID = processHashtag(hashtag);
              if (returnedID === 0) {
                return await ctx.reply('Букву О на цифру 0 да.');
              }
            
              const account = await database.getAccount(parseInt(returnedID));
            
              const Resources = {
                Gems: 'Gems',
                Box: 'Box',
                Gold: 'Gold',
                BigBox: 'BigBox',
                Starpoints: 'Starpoints',
                Tickets: 'Tickets',
                TokensDoubler: 'TokensDoubler'
                };
            
              if (resourceType === 'Name') {
                await database.replaceValue(account.lowID, resourceType, value);
              } else if (resourceType === 'Skins') {
                if (value === '[]') {
                  await database.replaceValue(account.lowID, resourceType, []);
                } else {
                  account.Skins.push(parseInt(value));
                  await database.replaceValue(account.lowID, resourceType, account.Skins);
                }
              } else if (Resources.hasOwnProperty(resourceType)) {
                account.Resources[resourceType] += parseInt(value);
                await database.replaceValue(account.lowID, 'Resources', account.Resources);
              } else {
                await ctx.reply('Неверный тип ресурса');
                break;
              }
            
              await ctx.reply('Успешно!');
              break;
            }
            case (messageText.startsWith('/vipADD')): {
              if(!config.admins.includes(parseInt(userId))){
                await ctx.reply('Нет прав!' + userId);
                break
              }
              const commandParams = ctx.message.text.split(' ');
                
              const playerId = processHashtag(commandParams[1]);
              const account = await database.getAccount(parseInt(playerId))
              var find2vip = tgacc.find(e => e.lowID === playerId)
              //if(find2vip !== null) await ctx.telegram.sendMessage(find2vip.id, `Вы получили ${config.serverName}Premium\nУдачной игры!`);
              if(account){
                account.Notification.push({
                    ID: 89,
                    index: account.Notification.length+1,
                    reward: 170,
                    type: 0,
                    date: new Date(),
                    claim: false,
                    text: ``
                  })
                  
                  await database.replaceValue(playerId, 'Notification', account.Notification);
                const newVip = { id: parseInt(playerId) };
                vips.push(newVip);
                fs.writeFile('./Laser.Server/vips.json', JSON.stringify(vips, null, 2), (err) => {
                  if (err) {
                    console.error('Ошибка сохранения файла с конфигурацией:', err);
                  }
                });
              } else return await ctx.reply(`Аккаунт не найден!`);
              await ctx.reply(`Выдали. ${playerId}`);
              break;
              }
            case (messageText.startsWith('/ban')): {
              if(!config.admins.includes(parseInt(userId))){
                await ctx.reply('Нет прав!' + userId);
                break
              }
              const commandParams = ctx.message.text.split(' ');
                
              const playerId = processHashtag(commandParams[1]);
              if (playerId === 0) return await ctx.reply('Букву О на цифру 0 да.')
      
                await database.replaceValue(playerId, 'Brawlers', [])
                await database.replaceValue(playerId, 'Trophies', 0)
                await database.replaceValue(playerId, 'Name', "Забанен")
      
                await ctx.reply(`Забанен`);
                break;
              }
            case (messageText.startsWith('/clubban')): {
              if(!config.admins.includes(parseInt(userId))){
                await ctx.reply('Нет прав!' + userId);
                break
              }
              const commandParams = ctx.message.text.split(' ');
                
              const clubID = processHashtag(commandParams[1]);
              if (clubID === 0) return await ctx.reply('Букву О на цифру 0 да.')
                const c = {
                    'Name': commandParams[2],
                };
                await database.clubUpdate(clubID, c);
      
                await ctx.reply(`Забанен`);
                break;
            }
      
      
            case (messageText.startsWith('/Statistics')): {
              if (!config.admins.includes(parseInt(userId))) {
                await ctx.reply('Нет прав!' + userId);
                break;
              }
              const rooms = gameroomInstance.getRooms();
              const currentDate = new Date();
              const StatisticsCollected = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()}`;
              const ServerStarted = `${global.ServerStarted.getDate()}.${global.ServerStarted.getMonth() + 1}.${global.ServerStarted.getFullYear()} ${global.ServerStarted.getHours()}:${global.ServerStarted.getMinutes() < 10 ? '0' + global.ServerStarted.getMinutes() : global.ServerStarted.getMinutes()}`;
              const rd = await database.getCounts();

              const SessionsData = await fs.readFile('./sessions.json', 'utf8');
              const SessionsParsed = JSON.parse(SessionsData);
              const data = {
                "Сервер был запущен": ServerStarted,
                "Количество игроков": global.online,
                "Игроков в день": rd.infodau,
                "Создано Команд": rooms.length,
                "Всего аккаунтов": rd.accountCount,
                "Всего Клубов": rd.clubCount,
				"Аккаунтов в боте" : SessionsParsed.sessions.length,
                "Статистика Собрана": StatisticsCollected
              };
              let reply = "";
              for (const key in data) {
                  reply += `"${key}": ${data[key]}\n`;
              }
              await ctx.reply(reply);
              break;
            }
            case (messageText.startsWith('/Send')): {
				const commandParams = ctx.message.text.split(' ');
				const messageToSend = commandParams.slice(1).join(' ').replace(/\\n/g, '\n');
				if (messageToSend.length === 0) return await ctx.reply(`Текста нету лол.`);
				const SessionsData = await fs.readFile('./sessions.json', 'utf8');
				const SessionsParsed = JSON.parse(SessionsData);

				const ids = [];
				SessionsParsed.sessions.forEach(session => {
					const sessionId = session.id.split(':')[0];
					if (!ids.includes(Number(sessionId))) {
						ids.push(Number(sessionId));
					}
				});
				var accepted = 0
				var cancled = 0
				for (const id of ids) {
					try {
						await bot.telegram.sendMessage(id, messageToSend);
						console.log(`Message sent to ${id}`);
						accepted += 1
					} catch (error) {
						cancled += 1
						console.error(`Error sending message to ${id}:`, error);
					}
				}
				return await ctx.reply(`${accepted} Приняли сообщение | ${cancled} Не получили.`);
			}
            default: {
                await ctx.reply(`Комманда не найдена.\nНапишите /start`);
                break;
            }
        }
    } catch (error) {
        console.log(error)
        config.admins.forEach(async e  => { await ctx.telegram.sendMessage(e, error);});
    }
});

bot.on('callback_query', async (ctx) => {
    const query = ctx.callbackQuery;
    switch(query.data){

        case "DonateMenu": {
            await DonateMenu(ctx);
            break;
        };
        case "MainMenu": {
            ctx.session.enterTag = false;
            ctx.session.Tag2Recovery = false;
            ctx.session.ConnectAccount = false;
            await MainMenu(ctx);
            break;
        };
        case "PremiumInfo": {
            await PremiumInfo(ctx);
            break;
        }
        case "Supports": {
            await Supports(ctx);
            break;
        }
        default: {
            if (query.data.startsWith("Account")) {
                await HandleAccount(ctx);
            }
            if (query.data.startsWith("Unlink")) {
                await UnlinkAccount(ctx);
            }
            if (query.data.startsWith("SPT")) {
                await SPT(ctx);
            }
            if (query.data.startsWith("Recovery")) {
                await Recovery(ctx);
            }
            break;
        }
    }
});

async function Supports(ctx) {
    try {
        await ctx.answerCbQuery();
        const messageText = `✅ | Задать любой вопрос/помочь решить проблему пишите - @thestealdev!`;
        await ctx.telegram.editMessageText(
            ctx.chat.id, ctx.session.MessageID, null,
            messageText,
            {
                reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                parse_mode: 'Markdown' 
            }
        );
    } catch (error) {
        console.log(error)
        config.admins.forEach(async e => { await ctx.telegram.sendMessage(e, error); });
    }
}

async function SPT(ctx) {
    await ctx.answerCbQuery();
    ctx.session.cost = parseInt(ctx.callbackQuery.data.split('_')[1]);
    var msg = ""
    if(ctx.session.cost === 99) msg = `${config.serverName} premium`
    if(ctx.session.cost !== 99) msg = `кристаллы`
    ctx.session.enterTag = true;
    await ctx.editMessageText(
        `👇 Введи свой #ТЕГ аккаунта на который ты получишь ${msg} Вводи свой тег внимательно.\n[Как узнать тег? (ЖМИ СЮДА)](${"https://telegra.ph/Gde-najti-TEG-igroka-10-15"})`,
        {
            reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
            parse_mode: 'Markdown' 
        }
    );
}

async function PremiumInfo(ctx){
    try {
        await ctx.answerCbQuery();
        await ctx.editMessageText(
            `Цена НАВСЕГДА: 99 рублей.\n\n` +
            `Mix Premium — подписка на ${config.serverName} Brawl, при оформлении которой ты значительно поддерживаешь проект и получаете привилегии на нашем сервере.\n\n` +
            `Что входит в подписку?\n` +
            `— 170 гемов на аккаунт\n` +
            `— уникальные градиент-цвета ника, которые доступны только игрокам с ${config.serverName} Premium\n` +
            `— Дополнительные 8 кубков за бой.\n\n`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Купить', callback_data: 'SPT_99' },{ text: 'Отмена', callback_data: `DonateMenu` }]
                    ]
                }
            }
        );
    } catch (error) {
        console.log(error)
        config.admins.forEach(async e => { await ctx.telegram.sendMessage(e, error); });
    }
}

async function UnlinkAccount(ctx) {
    try {
        await ctx.answerCbQuery();
        let accountID = parseInt(ctx.callbackQuery.data.split('_')[1]);
        const messageText = `унт был у от `;
        tgacc = tgacc.filter(e => e.lowID !== accountID);
        fs.writeFile('./Laser.Server/tgacc.json', JSON.stringify(tgacc, null, 2), (err) => {if (err) {console.error('Ошибка сохранения файла с конфигурацией:', err)}});
        await ctx.telegram.editMessageText(
            ctx.chat.id, ctx.session.MessageID, null,
            messageText,
            {
                reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                parse_mode: 'Markdown' 
            }
        );
    } catch (error) {
        console.log(error)
        config.admins.forEach(async e => { await ctx.telegram.sendMessage(e, error); });
    }
}

async function Recovery(ctx) {
    try{
        await ctx.answerCbQuery();
        let accountID = parseInt(ctx.callbackQuery.data.split('_')[1]);
        const messageText = `🔌 | Для восстановления аккаунта, вам нужно создать новый аккаунт.\nКак узнать тег аккаунта [(ЖМИ СЮДА)](${"https://telegra.ph/Kak-uznat-svoj-TEG-ID-v-TailerBrawl-06-17"}})\nОтпрвьте тег нового аккаунта в чат.`;
        ctx.session.Tag2Recovery = true;
        ctx.session.LowID2Recovery = accountID;
        await ctx.telegram.editMessageText(
            ctx.chat.id, ctx.session.MessageID, null,
            messageText,
            {
                reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                parse_mode: 'Markdown' 
            }
        );
    } catch (error) {
        config.admins.forEach(async e => { await ctx.telegram.sendMessage(e, error); });
    }
}

async function HandleAccount(ctx) {
    try {
        await ctx.answerCbQuery();
        let accountID = parseInt(ctx.callbackQuery.data.split('_')[1]);
        const acc = await database.getAccount(accountID)
		if(acc !== null){
			const messageText = `🔌 | Привет, ${acc.Name}\nКоличество трофеев: ${acc.Trophies}\nКристаллов: ${Math.round(acc.Resources.Gems)}\n\n⚠ При нажатии на 🍂Отвязать аккаунт,\n АККАУНТ СРАЗУ ОТВЯЖЕТСЯ!`;
			await ctx.telegram.editMessageText(
				ctx.chat.id, ctx.session.MessageID, null,
				messageText,
				{
					reply_markup: {inline_keyboard: [[{ text: `⚡Восстановить аккаунт`, callback_data: `Recovery_${accountID}` }],[{ text: `🍂Отвязать аккаунт`, callback_data: `Unlink_${accountID}` }],[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
					parse_mode: 'Markdown' 
				}
			);
		}
    } catch (error) {
        config.admins.forEach(async e => { await ctx.telegram.sendMessage(e, error); });
    }
}


async function ConnectAccount(ctx) {
    try {
        await ctx.answerCbQuery();
        const messageText = `Mix Connect переехал на сайт в игре\nПерейдите во вкладку "Новости".`;
        ctx.session.ConnectAccount = true;
        await ctx.telegram.editMessageText(
            ctx.chat.id, ctx.session.MessageID, null,
            messageText,
            {
                reply_markup: {inline_keyboard: [[{ text: `◀ Назад`, callback_data: `MainMenu` }]]},
                parse_mode: 'Markdown' 
            }
        );
    } catch (error) {
        config.admins.forEach(async e => { await ctx.telegram.sendMessage(e, error); });
    }
}


async function AccountsList(ctx) {
    try{
        await ctx.answerCbQuery();
        var ListKeyboard = [];
        const Acc2Players = tgacc.filter(plr => plr.id === ctx.chat.id)
        for (const e of Acc2Players){
            const acc = await database.getAccount(e.lowID)
            if(acc !== null) ListKeyboard.push([{ text: `${acc.Name} | ${acc.Trophies} Кубков`, callback_data: `Account_${e.lowID}` }]);
        }
        ListKeyboard.push([{ text: `◀ Назад`, callback_data: `MainMenu` }])
        await ctx.telegram.editMessageText(
            ctx.chat.id, ctx.session.MessageID, null,
            `Недоступно в боте`,
            {
                reply_markup: {inline_keyboard: ListKeyboard}
            }
        );
    } catch (error) {
        config.admins.forEach(async e  => { await ctx.telegram.sendMessage(e, error);});
    }
}

async function DonateMenu(ctx) {
    try{
        await ctx.answerCbQuery();
        await ctx.telegram.editMessageText(
            ctx.chat.id, ctx.session.MessageID, null,
            `🔍 | Выбери товар, который ты хочешь купить:`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `${config.serverName} Premium`, callback_data: `PremiumInfo` }],
                        [{ text: `170 Кристаллов`, callback_data: `SPT_100` }],
                        [{ text: `360 Кристаллов`, callback_data: `SPT_150` }],
                        [{ text: `950 Кристаллов`, callback_data: `SPT_250` }],
                        [{ text: `2000 Кристаллов`, callback_data: `SPT_400` }],
                        [{ text: `4500 Кристаллов`, callback_data: `SPT_600` }],
                        [{ text: `◀ Назад`, callback_data: `MainMenu` }]
                    ]
                }
            }
        );
    } catch (error) {
        config.admins.forEach(async e  => { await ctx.telegram.sendMessage(e, error);});
    }
}

async function MainMenu(ctx) {
    try{
        await ctx.answerCbQuery();
        await ctx.telegram.editMessageText(
            ctx.chat.id, ctx.session.MessageID, null, 
            `💫 | Привет!\n\nЗдесь ты сможешь привязать аккаунт в ${config.serverName}Brawl`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💰 Донат', callback_data: `DonateMenu` },{ text: '👥 Поддержка', callback_data: `Supports` }]
                    ]
                }
            }
        );
    } catch (error) {
        config.admins.forEach(async e  => { await ctx.telegram.sendMessage(e, error);});
    }
}

bot.catch((err, ctx) => {
    if (err.code === 403 && err.description.includes('blocked by the user')) return;
    console.error('Произошла ошибка:', err);
});

module.exports = bot;

const path = require("node:path");
const fs = require("fs");
require("../PirateBrawl.Server/Debug/Debugger");

class MessageFactory {
  constructor() {
    this.messages = {};
    this.messagesList = [];

    const directories = [
      "../PirateBrawl.Logic/Messages/Account",
      "../PirateBrawl.Logic/Messages/Battle",
      "../PirateBrawl.Logic/Messages/Home",
      "../PirateBrawl.Logic/Messages/Ranking",
      "../PirateBrawl.Logic/Messages/Team"
    ];

    // Загружаем сообщения из директорий
    directories.forEach((directory) => {
      this.loadMessagesFromDirectory(directory);
    });

    // Специальная проверка на LoginMessage
    this.loadLoginMessage("../PirateBrawl.Logic/Messages/Account/LoginMessage");

    // Проверка наличия сообщения с ID 10101
    if (!this.messages[10101]) {
      console.error('Message with ID 10101 not found.');
      process.exit(1); // Завершение работы программы
    }

    ServerLog("Loaded Messages:", this.messagesList);
  }

  // Метод загрузки сообщений из директории
  loadMessagesFromDirectory(directory) {
    const fullPath = path.join(__dirname, directory);

    try {
      const files = fs.readdirSync(fullPath);

      files.forEach((file) => {
        if (file.endsWith(".js") && file !== "MessageFactory.js") {
          try {
            const MessageClass = require(path.join(fullPath, file));
            const MessageInstance = new MessageClass();

            this.messages[MessageInstance.id] = MessageClass;
            this.messagesList.push(MessageInstance.id);
          } catch (err) {
            Error(`A wild error occurred while initializing "${file.split("/").slice(-1)}" message!`);
            console.log(err);
          }
        }
      });
    } catch (err) {
      console.error(`Error reading directory "${directory}":`, err);
    }
  }

  loadLoginMessage(filePath) {
    const fullPath = path.join(__dirname, filePath);

    try {
      const MessageClass = require(fullPath);
      const MessageInstance = new MessageClass();

      this.messages[MessageInstance.id] = MessageClass;
      this.messagesList.push(MessageInstance.id);
    } catch (err) {
      console.error(`Error loading LoginMessage from "${filePath}":`, err);
      process.exit(1);
    }
  }

  getMessage(id) {
    return this.messagesList.includes(id) ? this.messages[id] : null;
  }
}

module.exports = MessageFactory;

require("../../PirateBrawl.Server/Debug/Debugger");

const fs = require("fs");
const path = require("node:path");

class CommandManager {
  constructor() {
    this.commands = {};
    this.commandList = [];

    // Директории, в которых мы ищем команды
    const directories = [
      "./Home"
    ];

    directories.forEach((directory) => {
      this.loadCommandsFromDirectory(directory);
    });

    ServerLog("Loaded Commands:", this.commandList);
  }

  loadCommandsFromDirectory(directory) {
    const fullPath = path.join(__dirname, directory);

    fs.readdir(fullPath, (err, files) => {
      if (err) {
        console.error(`Ошибка при чтении директории "${directory}":`, err);
        return;
      }

      files.forEach((file) => {
        if (file.endsWith(".js")) {
          try {
            const Command = require(path.join(fullPath, file));

            // Создаём экземпляр команды, чтобы получить commandID
            const commandInstance = new Command();

            if (commandInstance && commandInstance.commandID) {
              this.commands[commandInstance.commandID] = Command; // Сохраняем сам класс по его commandID
              this.commandList.push(commandInstance.commandID);
            } else {
              console.warn(`Файл ${file} не содержит валидного commandID.`);
            }
          } catch (err) {
            console.error(`Ошибка при загрузке команды из файла "${file}":`, err);
          }
        }
      });
    });
  }

  handle(id) {
    return this.commands[id];
  }

  getCommands() {
    return Object.keys(this.commands);
  }
}

module.exports = CommandManager;

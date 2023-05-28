require("dotenv").config();
const token = process.env.token;
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });
const webAppUrl = "https://github.com/babymama111?tab=repositories";
const SCH = require("./models/schedule.js");

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '') {
      console.log('Error: message text is empty');
      return;
    }
    if (text === "/start") {
      await bot.sendAnimation(
        chatId,
        "https://tlgrm.eu/_/stickers/524/c46/524c462c-690d-3f05-ae42-4183400e0a7c/5.webp"
      );
      return bot.sendMessage(chatId, `Привет,сынку`);
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `${msg.from.first_name || "Вася"} AK ${
          msg.from.last_name || "пупкин"
        }, этот бот поможет в планировании учебной деятельности, он может показывать расписание, дедлайны. Ты можешь взаимодействовать с дедлайнами. Расписание может редачить только папа (Берулава Илья). Все просто. )`
      );
    }

    if (text === "/checkschedule") {
      const sched = SCH;
      let message = `Расписание для СМ6-82 :\n\n`; //тут менять название группы
      for (let day in sched) {
        message += ` ${day} :\n`;
        for (let time of sched[day]) {
          for (let key in time) {
            if (key.startsWith("time")) {
              message += `  ${time[key]}:  ${time.subject}\n`;
            }
          }
        }
        message += "\n";
      }
      return bot.sendMessage(chatId, message);
    }

    if (text === "/checkdead") {
      let result = "";
      let data;
      try {
         data = require("./models/dead.json");
      } catch (error) {
        return bot.sendMessage(
          chatId,
          "скорее всего дедлайнов нема "
        );}
      try {
        
        data.forEach((obj) => {
          for (let key in obj) {
            result += `---${key}---${obj[key].date}---${obj[key].comments}---\n`;
          }
        });
        return bot.sendMessage(chatId, result);
      } catch (error) {
        return bot.sendMessage(
          chatId,
          "либо нет дедлайнов, либо ты чета перепутал"
        );
      }
    }

    if (text === "/adddeaddate") {
      bot
        .sendMessage(chatId, `Отправьте сообщение в формате json `)
        .then(() => {
          bot.sendMessage(
            chatId,
            `{"Брисо": {
                "date": "20.05.2023",
                "comments": "Понюхать бебру"
              }}`
          );
        })
        .then(() => {
          // Ожидаем сообщения от пользователя в формате json
          bot.once("message", (jsonMsg) => {
            // Парсим текст сообщения в JSON

            let data;
            let arr = [];
            try {
              data = JSON.parse(fs.readFileSync("./models/dead.json"));
              for (let key in data) {
                if (!isNaN(key)) {
                  let arrElement = {};
                  arrElement[key] = data[key];
                  arr.push(arrElement[key]);
                }
              }
            } catch (err) {
              console.error(err);
              bot.sendMessage(chatId, "Ошибка при чтении файла");
              return;
            }

            // Добавляем новые данные в массив и записываем их в файл
            try {
              const newObj = JSON.parse(jsonMsg.text);
              arr.push(newObj);
            } catch (err) {
              console.log("Ошибка при разборе JSON: " + err.message);
              bot.sendMessage(chatId, "Ты неправльно ввел, малыш");
              return;
            }

            fs.writeFileSync(
              "./models/dead.json",
              JSON.stringify(arr, null, 2)
            );

            // Сообщаем пользователю о том, что данные были успешно добавлены
            bot.sendMessage(chatId, "Новые данные успешно добавлены");
          });
        });
    }

    if (text === "/deletedeaddate") {
      bot
        .sendMessage(
          chatId,
          "Отправьте всю строку дедлайна, который хотите удалить, которую хотите удалить"
        )
        .then(() => {
          try {
            bot.once("message", (jsonMsg) => {
              const parameters = jsonMsg.text;
              const [name, date, comments] = parameters
                .split("---")
                .filter((x) => x !== "");
              const data = require("./models/dead.json");
              for (let i = 0; i < data.length; i++) {
                let obj = data[i];
                let objName = Object.keys(obj)[0];
                let objData = obj[objName];

                if (
                  objName === name &&
                  objData.date === date &&
                  objData.comments === comments
                ) {
                  data.splice(i, 1);
                  fs.writeFileSync(
                    "./models/dead.json",
                    JSON.stringify(data, null, 2))
                  return bot.sendMessage(chatId, "Дедлайн удален");
                }
              }
            });
          } catch (err) {
            console.log("Ошибка при разборе JSON: " + err.message);
            return bot.sendMessage(
              chatId,
              `что-то пошло не так попробуй загуглить ошибку: ${err.message}`
            );
          }
        });
    }

    if (text === "/papa") {
      return bot.sendMessage(chatId, "Можешь подписаться", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Гитхаб Папы", web_app: { url: webAppUrl } }],
          ],
        },
      });
    }
  });
  // bot.on("polling_error", console.log);
};
bot.setMyCommands([
  { command: "/start", description: "Привет" },
  { command: "/info", description: " Функционал?" },
  { command: "/checkschedule", description: "Посмотреть расписание" },
  { command: "/checkdead", description: "Посмотреть дедлайны" },
  { command: "/adddeaddate", description: "Добавить дату дедлайна" },
  { command: "/deletedeaddate", description: "Удалить дату дедлайна" },
  { command: "/papa", description: "чекни папу" },
]);

start();
// setTimeout(() => socket.end(), 30000)

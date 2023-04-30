require('dotenv').config();
const token = process.env.token
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, {polling: true});
const webAppUrl = 'https://www.youtube.com/watch?v=MzO-0IYkZMU&t=127s&ab_channel=UlbiTV'
const  SCH = require('./models/schedule.js') ;

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ilya:1898@cluster0.ftnqe1z.mongodb.net/test')
.then(()=>{
    console.log("db ok")})
.catch((err)=>{
    console.log("db err", err);
});


const start = () =>{
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        if(text === '/start'){
           await bot.sendAnimation(chatId,'https://tlgrm.eu/_/stickers/524/c46/524c462c-690d-3f05-ae42-4183400e0a7c/5.webp')
           return bot.sendMessage(chatId,`Привет,сынку`)
        }
       
        if(text === '/info'){
            return bot.sendMessage(chatId,`${msg.from.first_name} AK ${msg.from.last_name}, этот бот поможет в планировании учебной деятельности, он может показывать расписание, дедлайны. Ты можешь задавать дедлайны. Расписание может редачить только папа(Берулава Илья) Все просто. Также можешь погамать в игрульку на скучной паре)`)
        }

        if(text === '/checkschedule'){
            const today = new Date();
            const month = today.getMonth()
            // ('0' + (today.getMonth() + 1)).slice(-2);
            const day = ('0' + today.getDate()).slice(-2);
            const year = today.getFullYear();
            const formattedDate = `${day}/${month}/${year}`
           
            // if(data == 0){
                return bot.sendMessage(chatId, da)
            // }
        }


        if(text === '/checkdead'){
           
        }
        if(text === '/adddeaddate'){
          
        }
        if(text === '/deletedeaddate'){
          
        }

        if(text === '/game'){
            await bot.sendMessage(chatId, "тут игра!", {
                reply_markup:{
                    inline_keyboard: [
                        [{text: 'Гамать', web_app: {url: webAppUrl}}]
                    ]
                }
            })
        }
   
          return bot.sendMessage(chatId,`я тебя не понимаю, другалЁк`)
    
    })

}
bot.setMyCommands([
    {command: '/start', description: 'Привет'},
    {command: '/info', description: ' Функционал?'},
    {command: '/checkschedule', description: 'Посмотреть расписание'},
    {command: '/checkdead', description: 'Посмотреть дедлайны'},
    {command: '/adddeaddate', description: 'Добавить дату дедлайна'},
    {command: '/deletedeaddate', description: 'Удалить дату дедлайна'},
    {command: '/game', description: 'Играть в самую скучную игру'},
])

start()
// setTimeout(() => socket.end(), 30000)
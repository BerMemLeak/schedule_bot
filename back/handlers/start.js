export default async function Start(){
    await bot.sendAnimation(
      chatId,
      "https://tlgrm.eu/_/stickers/524/c46/524c462c-690d-3f05-ae42-4183400e0a7c/5.webp"
    );
    return bot.sendMessage(chatId, `Привет,сынку`);
  }

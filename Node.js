const { Telegraf } = require('telegraf');
const { OpenAI } = require('openai');

// Load API keys from environment variables
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!telegramToken || !openaiApiKey) {
  console.error('Missing API keys. Set TELEGRAM_BOT_TOKEN and OPENAI_API_KEY in Secrets.');
  process.exit(1);
}

const bot = new Telegraf(telegramToken);
const openai = new OpenAI({ apiKey: openaiApiKey });

// Start command
bot.start((ctx) => ctx.reply('Salom! Men ChatGPT bilan ishlayman. Savol bering.'));

// Handle text messages
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-4' if you have access
      messages: [{ role: 'user', content: userMessage }],
    });
    const response = completion.choices[0].message.content;
    ctx.reply(response);
  } catch (error) {
    console.error(error);
    ctx.reply('Xatolik yuz berdi. Keyinroq urinib koʻring.');
  }
});

// Launch the bot
bot.launch();
console.log('Bot ishga tushdi!');

// Handle graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));.

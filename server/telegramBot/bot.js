const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const awaitingEmailMap = new Map();
bot.start(async (ctx) => {
  const chatId = ctx.chat.id;

  awaitingEmailMap.set(chatId, true); // Mark this chat as waiting for email

  return ctx.reply(
    "👋 Welcome! Please reply with your email to complete Telegram linking."
  );
 
});

bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const text = ctx.message.text.trim();

  // Only act if we're waiting for email
  if (!awaitingEmailMap.get(chatId)) {
    return ctx.reply("ℹ️ Please type /start to begin linking your Telegram.");
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(text)) {
    return ctx.reply("⚠️ That doesn't look like a valid email. Please try again.");
  }

  // Stop listening for email now
  awaitingEmailMap.delete(chatId);

  try {
    await axios.post("http://localhost:8000/api/store-telegram", {
      email: text,
      chatId,
    });

    ctx.reply("✅ Telegram successfully linked to your account!");
  } catch (err) {
    if (err.response && err.response.status === 409) {
    ctx.reply("🔁 This email is already linked to this Telegram account.");
  } else if (err.response && err.response.status === 404) {
    ctx.reply("❌ Email not found. Please sign up first.");
  } else {
    console.error("❌ Error storing chat ID:", err.message);
    ctx.reply("❌ Failed to link Telegram. Try again later.");
  }
  }
});


bot.command("cancel", (ctx) => {
  awaitingEmailMap.delete(ctx.chat.id);
  ctx.reply("❌ Linking cancelled. Type /start to try again.");
});


module.exports = bot;
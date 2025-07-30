const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/user"); // ✅ Import your User model

// // ✅ Telegram webhook route
router.post("/telegram/webhook", async (req, res) => {
  try {
    const msg = req.body.message;
    const chatId = msg.chat.id;
    const email = msg.text;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        text: "Email not found. Please register first.",
      });
    }

    user.telegramChatId = chatId;
    await user.save();

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: `✅ Telegram notifications activated for ${email}`,
      }
    );

    res.status(200).send("Chat ID saved");
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
});

// ✅ Manual storage route
router.post("/store-telegram", async (req, res) => {
  const { email, chatId } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send("User not found");

   // Already linked
    if (user.telegramChatId) {
      return res.status(409).json({ message: "Telegram already linked." });
    }
  user.telegramChatId = chatId;
  await user.save();

  res.send("Chat ID stored successfully");
});

module.exports = router;

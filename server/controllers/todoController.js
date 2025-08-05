const Todo = require("../models/todoList");
const User = require("../models/user");
const twilio = require("twilio");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const sendEmail = require("../utlis/mailer");
const axios = require("axios");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);

exports.getTodos = async (req, res) => {
  const userId = req.user._id;

  const todos = await Todo.find({ userId });
  res.json(todos);
};

exports.createTodo = async (req, res) => {
  const userId = req.user._id;
  let {
    toDoList,
    phoneNumber,
    whatsappOptIn,
    emailOptIn,
    email,
    telegramOptIn,
  } = req.body;

  const user = await User.findById(userId);

  toDoList = toDoList.map((task) => ({
    ...task,
    id: uuidv4(),
    done: task.done ?? false,
  }));

  const existing = await Todo.findOne({ userId });

  let updated;
  if (existing) {
    existing.toDoList.push(...toDoList);
    updated = await existing.save();
  } else {
    updated = await Todo.create({ userId, toDoList });
  }
  let message = `Hello,\n\n 📝 You've added new tasks to your TODO list:`;
  toDoList.forEach((task, idx) => {
    message += `\n${idx + 1}. "${task.title}"`;
    if (task.dueDate) {
      const formattedDate = new Date(updatedTask.dueDate).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      );
      message += `\n   📅 Due Date: ${formattedDate}`;
    }
    if (task.dueTime) message += `\n   ⏰ Due Time: ${task.dueTime}`;
    message += `\n  Happy connecting 😊!\n- TODO App`;
  });
  // ✅ WhatsApp Notification
  if (whatsappOptIn && phoneNumber) {
    try {
      await client.messages.create({
        body: message,
        from: "whatsapp:+14155238886", // Twilio sandbox sender
        to: `whatsapp:${phoneNumber}`, // e.g. whatsapp:+91xxxxxxxxxx
      });

      console.log("WhatsApp notification sent ✅");
    } catch (error) {
      console.error("❌ WhatsApp send failed", error.message);
    }
  }

  // ✅ Email Notification
  if (emailOptIn && email) {
    try {
      const subject = "📝 New Tasks Added to Your TODO List";
      await sendEmail(email, subject, message);
      console.log("📧 Email notification sent ✅");
    } catch (error) {
      console.error("❌ Email send failed", error.message);
    }
  }

  // ✅ Telegram Notification
  if (telegramOptIn && user.telegramChatId) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: user.telegramChatId,
          text: message,
        }
      );
      console.log("📨 Telegram notification sent ✅");
    } catch (error) {
      console.error("❌ Telegram send failed", error.message);
    }
  }

  const finalTodo = await Todo.findOne({ userId });
  res.status(201).json({
    message: "Todo(s) created",
    todo: finalTodo.toDoList,
  });
};

exports.updateTodoStatus = async (req, res) => {
  const userId = req.user._id;
  const {
    id,
    done,
    phoneNumber,
    whatsappOptIn,
    emailOptIn,
    email,
    telegramOptIn,
    telegramChatId,
  } = req.body;

  if (!id || typeof done !== "boolean") {
    return res.status(400).json({ error: "Todo ID and done status required" });
  }

  try {
    const updated = await Todo.findOneAndUpdate(
      { userId, "toDoList._id": new mongoose.Types.ObjectId(id) },
      { $set: { "toDoList.$.done": done } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // ✅ Find the updated task
    const updatedTask = updated.toDoList.find(
      (task) => task._id.toString() === id
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Updated task not found" });
    }

    // ✅ Create message
    let message = `Hello,\n\n ✅ You have updated task "${
      updatedTask.title
    }" to ${done ? "completed" : "incomplete"}.`;
    if (updatedTask.dueDate) {
      const formattedDate = new Date(updatedTask.dueDate).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      );
      message += `\n   📅 You have due date till ${formattedDate}`;
    }
    if (updatedTask.dueTime)
      message += `\n   ⏰ You have due time till ${updatedTask.dueTime}`;

    message += `\n  Happy connecting 😊!\n- TODO App`;

    // ✅ WhatsApp Notification
    if (whatsappOptIn && phoneNumber && updatedTask) {
      try {
        await client.messages.create({
          body: message,
          from: "whatsapp:+14155238886", // Twilio sandbox sender
          to: `whatsapp:${phoneNumber}`,
        });

        console.log("WhatsApp notification sent ✅");
      } catch (error) {
        console.error("❌ WhatsApp send failed", error.message);
      }
    }

    // ✅ Email Notification
    if (emailOptIn && email) {
      try {
        const subject = "📝 Tasks Updated to Your TODO List";
        await sendEmail(email, subject, message);
        console.log("📧 Email notification sent ✅");
      } catch (error) {
        console.error("❌ Email send failed", error.message);
      }
    }

    // ✅ Telegram Notification
    if (telegramOptIn && telegramChatId) {
      try {
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: telegramChatId,
            text: message,
          }
        );
        console.log("📨 Telegram notification sent ✅");
      } catch (error) {
        console.error("❌ Telegram send failed", error.message);
      }
    }

    res.json({ message: "Todo updated", todo: updated });
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteTodoItem = async (req, res) => {
  const userId = req.user._id;
  const { id, phoneNumber, whatsappOptIn, emailOptIn, email, telegramOptIn } =
    req.body;

  if (!id) {
    return res.status(400).json({ error: "Todo ID is required" });
  }

  try {
    const todoDoc = await Todo.findOne({ userId });
    const taskToDelete = todoDoc?.toDoList.find(
      (task) => task._id.toString() === id
    );

    if (!taskToDelete) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const user = await User.findById(userId);

    const updated = await Todo.findOneAndUpdate(
      { userId },
      { $pull: { toDoList: { _id: new mongoose.Types.ObjectId(id) } } },
      { new: true }
    );

    let message = `Hello,\n\n 🗑️ You have deleted the task "${taskToDelete.title}" from your TODO list.`;
    message += `\n  Happy connecting 😊!\n- TODO App`;

    // ✅ WhatsApp Notification
    if (whatsappOptIn && phoneNumber) {
      try {
        await client.messages.create({
          body: message,
          from: "whatsapp:+14155238886", // Twilio sandbox sender
          to: `whatsapp:${phoneNumber}`,
        });

        console.log("WhatsApp notification sent ✅");
      } catch (error) {
        console.error("❌ WhatsApp send failed", error.message);
      }
    }

    // ✅ Email Notification
    if (emailOptIn && email) {
      try {
        const subject = "📝 Tasks Deleted From Your TODO List";

        await sendEmail(email, subject, message);
        console.log("📧 Email notification sent ✅");
      } catch (error) {
        console.error("❌ Email send failed", error.message);
      }
    }

    // ✅ Telegram Notification
    if (telegramOptIn && user.telegramChatId) {
      try {
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: user.telegramChatId,
            text: message,
          }
        );
        console.log("📨 Telegram notification sent ✅");
      } catch (error) {
        console.error("❌ Telegram send failed", error.message);
      }
    }

    res.json({ message: "Todo deleted", todo: updated });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Server error" });
  }
};

function extractTaskName(query) {
  if (!query || typeof query !== "string") return "";
  return query
    .replace(/what('?s| is)? the status of/i, "")
    .replace(/\?$/, "")
    .trim();
}

exports.queryItem = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user._id;

    const taskName = extractTaskName(query);

    if (!taskName || taskName.length < 1) {
      return res.status(400).json({ message: "Query is empty" });
    }

    const todo = await Todo.findOne({ userId });

    if (!todo || !todo.toDoList || todo.toDoList.length === 0) {
      return res.json({ message: `No tasks found for user.` });
    }

    const matchingTasks = todo.toDoList.filter((item) =>
      new RegExp(taskName, "i").test(item.title)
    );

    if (matchingTasks.length === 0) {
      return res.json({ message: `No task found for "${taskName}"` });
    }

    const taskSummaries = matchingTasks.map((task) => ({
      title: task.title,
      done: task.done,
      dueDate: new Date(task.dueDate).toDateString(),
      dueTime: task.dueTime,
    }));

    return res.json({
      message: `${matchingTasks.length} task(s) found.`,
      data: taskSummaries,
    });
  } catch (error) {
    console.error("queryItem error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

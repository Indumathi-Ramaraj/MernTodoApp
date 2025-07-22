const Todo = require("../models/todoList");
const twilio = require("twilio");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const sendEmail = require("../utlis/mailer");

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
  let { toDoList, phoneNumber, whatsappOptIn, emailOptIn, email } = req.body;

  toDoList = toDoList.map((task) => ({
    ...task,
    id: uuidv4(),
    done: task.done ?? false,
  }));

  let updated;
  const existing = await Todo.findOne({ userId });

  if (existing) {
    existing.toDoList.push(...toDoList);
    updated = await existing.save();
  } else {
    updated = await Todo.create({ userId, toDoList });
  }

  const taskText = toDoList
    .map((task, idx) => `${idx + 1}. ${task.title}`)
    .join("\n");

  // ✅ WhatsApp Notification
  if (whatsappOptIn && phoneNumber) {
    try {
      const messageBody = `📝 You added new tasks to your TODO list:\n${taskText}`;

      await client.messages.create({
        body: messageBody,
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
      const message = `Hello,\n\nYou've added the following tasks:\n\n${taskText}\n\nHappy connecting 😊!\n- TODO App`;

      await sendEmail(email, subject, message);
      console.log("📧 Email notification sent ✅");
    } catch (error) {
      console.error("❌ Email send failed", error.message);  
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
  const { id, done, phoneNumber, whatsappOptIn, emailOptIn, email } = req.body;

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

    // ✅ Find the specific task updated
    const updatedTask = updated.toDoList.find(
      (task) => task._id.toString() === id
    );

    // ✅ WhatsApp Notification
    if (whatsappOptIn && phoneNumber && updatedTask) {
      try {
        const messageBody = `✅ You have updated task *"${
          updatedTask.title
        }"* to *${done ? "completed" : "incomplete"}*.`;

        await client.messages.create({
          body: messageBody,
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
        const message = `Hello,\n\n ✅ You have updated task ${
          updatedTask.title
        } to ${
          done ? "completed" : "incomplete"
        }.\n\nHappy connecting 😊!\n- TODO App`;

        await sendEmail(email, subject, message);
        console.log("📧 Email notification sent ✅");
      } catch (error) {
        console.error("❌ Email send failed", error.message);
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
  const { id, phoneNumber, whatsappOptIn, emailOptIn, email } = req.body;

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

    const updated = await Todo.findOneAndUpdate(
      { userId },
      { $pull: { toDoList: { _id: new mongoose.Types.ObjectId(id) } } },
      { new: true }
    );

    // ✅ WhatsApp Notification
    if (whatsappOptIn && phoneNumber) {
      try {
        const messageBody = `🗑️ You have deleted the task "${taskToDelete.title}"* from your TODO list.`;
        await client.messages.create({
          body: messageBody,
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
        const message = `Hello,\n\n 🗑️ You have deleted the task ${taskToDelete.title} from your TODO list.\n\nHappy connecting 😊!\n- TODO App`;

        await sendEmail(email, subject, message);
        console.log("📧 Email notification sent ✅");
      } catch (error) {
        console.error("❌ Email send failed", error.message);
      }
    }

    res.json({ message: "Todo deleted", todo: updated });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Server error" });
  }
};

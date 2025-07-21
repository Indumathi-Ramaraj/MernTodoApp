const Todo = require("../models/todoList");
const twilio = require("twilio");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

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
  let { toDoList, phoneNumber, whatsappOptIn } = req.body;

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

  // ✅ WhatsApp Notification
  if (whatsappOptIn && phoneNumber) {
    try {
      const taskText = toDoList
        .map((task, idx) => `${idx + 1}. ${task.title}`)
        .join("\n");

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

  const newTodo = await Todo.create({ userId, toDoList });
  res.status(201).json({ message: "Todo created", todo: newTodo });
};

exports.updateTodoStatus = async (req, res) => {
  const userId = req.user._id;
  const { id, done } = req.body;

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

    res.json({ message: "Todo updated", todo: updated });
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteTodoItem = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Todo ID is required" });
  }

  try {
    const updated = await Todo.findOneAndUpdate(
      { userId },
      { $pull: { toDoList: { _id: new mongoose.Types.ObjectId(id) } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted", todo: updated });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Server error" });
  }
};

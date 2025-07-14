const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { _id: true } // each item gets its own ObjectId
);

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // assumes your User model is named 'user'
      required: true,
    },
    toDoList: {
      type: [itemSchema], // allows storing array of JSON objects
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);

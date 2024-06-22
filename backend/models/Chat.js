const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  from: {
    type: Number,
    required: true,
  },
  to: {
    type: Number,
    required: true,
  },
  chat: {
    type: String,
  },
  pin: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    min: [8, "phoneNumber's length is {VALUE}, minimum required is 8"],
  },
  friends: {
    type: [Number],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

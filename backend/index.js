const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("port", 3000);

var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwt = require("jsonwebtoken");
const JWT_KEY = "ChallengeFPWM6";

const User = require("./models/User");
const Chat = require("./models/Chat");

// Endpoint
app.get("/test", (req, res) => {
  return res.send("Backend Praktikum FPW Minggu 7");
});

// USER
app.get("/api/users", async (req, res) => {
  let { username } = req.query;

  if (username) {
    const result = await User.findOne({ username: username });
    if (!result) return res.status(400).send("Error");
    return res.status(200).json(result);
  } else {
    const result = await User.find();
    if (!result) return res.status(400).send("Error");
    return res.status(200).json(result);
  }
});

app.get("/api/users/:id", async (req, res) => {
  let { id } = req.params;

  if (id) {
    const result = await User.findOne({ id: id });
    if (!result) return res.status(400).send("Error");
    return res.status(200).json(result);
  }
});

app.post("/api/users", async (req, res) => {
  let { username, password, phoneNumber, token } = req.body;

  if (token) {
    // GetUserByToken
    try {
      const id = jwt.verify(token, JWT_KEY);
      console.log(id);

      const result = await User.findOne({ id: id.id });
      if (!result) return res.status(400).send("Error");
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).send(error);
    }
  } else {
    const users = await User.find();

    let newId = users[users.length - 1].id + 1;

    const result = await User.insertMany([
      {
        id: newId,
        username: username,
        password: password,
        phoneNumber: phoneNumber,
      },
    ]);

    if (!result) return res.status(400).send("Error");
    return res.status(201).json(result);
  }
});

app.put("/api/users/:id/add", async (req, res) => {
  let { id } = req.params;
  let { friendId } = req.body;

  let updateUser = await User.findOneAndUpdate(
    { id: id },
    {
      $push: {
        friends: friendId,
      },
    }
  );
  let updateFriend = await User.findOneAndUpdate(
    { id: friendId },
    {
      $push: {
        friends: id,
      },
    }
  );

  return res.status(201).send("Updated");
});

app.post("/api/login", (req, res) => {
  let { id } = req.body;

  let token = jwt.sign(
    {
      id: id,
    },
    JWT_KEY
  );

  return res.status(201).send(token);
});

app.get("/api/chats", async (req, res) => {
  let chats = await Chat.find();
  return res.status(200).send(chats);
});

app.get("/api/chats/:Id", async (req, res) => {
  let { Id } = req.params;
  if (Id) {
    let result = await Chat.findOne({ id: Number(Id) });
    return res.status(200).send(result);
  }
});

app.post("/api/chats", async (req, res) => {
  let { from, to, chat } = req.body;

  let chats = await Chat.find();

  let newId = chats[chats.length - 1].id + 1;
  let pin = false;
  let status = "unread";

  let result = {
    id: newId,
    from: from,
    to: to,
    chat: chat,
    pin: pin,
    status: status,
  };

  let newChat = await Chat.insertMany([result]);

  return res.status(201).send(result);
});

app.put("/api/chats/:Id/pin", async (req, res) => {
  let { Id } = req.params;
  if (Id) {
    let result = await Chat.findOne({ id: Number(Id) });
    let pin = result.pin;

    let update = await Chat.findOneAndUpdate(
      { id: Number(Id) },
      {
        pin: !pin,
      }
    );
    return res.status(201).send(update);
  }
});

app.put("/api/chats/status", async (req, res) => {
  let { userId, friendId } = req.body;

  // const userChats = chats.filter((c) => c.from == userId || c.to == userId);
  const userChats = await Chat.find({
    $or: [{ from: userId }, { to: userId }],
  });
  const currentChats = userChats.filter(
    (c) => c.from == friendId || c.to == friendId
  );

  for (let i = 0; i < currentChats.length; i++) {
    const chat = currentChats[i];

    const update = await Chat.findOneAndUpdate(
      { id: chat.id },
      { status: "read" }
    );
  }

  return res.status(201).send("update");
});

app.delete("/api/chats/:Id", async (req, res) => {
  let { Id } = req.params;
  // let result = chats.filter((c) => c.id != Id);
  let result = await Chat.findOneAndDelete({ id: Id });
  return res.status(201).send(chats);
});

// Listening
app.listen(app.get("port"), async () => {
  const db = "dbm7_221116958";
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${db}`);
    console.log("Database connected");
  } catch (e) {
    console.log("Error database connection \n", e);
  }
  console.log(`Server started at http://localhost:${app.get("port")}`);
});

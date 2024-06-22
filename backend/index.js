const express = require("express");

const app = express();
app.set("port", 3000);

var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwt = require("jsonwebtoken");
const JWT_KEY = "ChallengeFPWM6";

// Data
let users = [
  {
    id: 1,
    username: "elysia",
    password: "elysia",
    phoneNumber: "12345678",
    friends: [2, 3, 4],
  },
  {
    id: 2,
    username: "mei",
    password: "mei",
    phoneNumber: "87654321",
    friends: [1],
  },
  {
    id: 3,
    username: "kiana",
    password: "kiana",
    phoneNumber: "12312312312",
    friends: [1],
  },
  {
    id: 4,
    username: "bronya",
    password: "bronya",
    phoneNumber: "12312312312",
    friends: [1, 2, 3],
  },
  {
    id: 5,
    username: "fuhua",
    password: "fuhua",
    phoneNumber: "12312312312",
    friends: [],
  },
  {
    id: 6,
    username: "kevin",
    password: "kevin",
    phoneNumber: "12312312312",
    friends: [],
  },
  {
    id: 7,
    username: "eden",
    password: "eden",
    phoneNumber: "12312312312",
    friends: [],
  },
];

let chats = [
  {
    id: 1,
    from: 1,
    to: 2,
    chat: "wkwk",
    pin: true,
    status: "read",
  },
  {
    id: 2,
    from: 2,
    to: 1,
    chat: "pinjam seratus",
    pin: false,
    status: "unread",
  },
  {
    id: 3,
    from: 1,
    to: 3,
    chat: "belum makan",
    pin: false,
    status: "read",
  },
  {
    id: 4,
    from: 4,
    to: 1,
    chat: "gas by1 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    pin: false,
    status: "unread",
  },
  {
    id: 5,
    from: 2,
    to: 1,
    chat: "pinjam seratus",
    pin: false,
    status: "unread",
  },
  {
    id: 6,
    from: 2,
    to: 1,
    chat: "pinjam seratus",
    pin: false,
    status: "unread",
  },
  {
    id: 7,
    from: 2,
    to: 1,
    chat: "pinjam seratus",
    pin: false,
    status: "unread",
  },
  {
    id: 8,
    from: 2,
    to: 1,
    chat: "pinjam seratus",
    pin: false,
    status: "unread",
  },
  {
    id: 9,
    from: 2,
    to: 1,
    chat: "pinjam seratus",
    pin: false,
    status: "unread",
  },
  {
    id: 10,
    from: 2,
    to: 1,
    chat: "pinjam seratus",
    pin: false,
    status: "unread",
  },
  {
    id: 11,
    from: 2,
    to: 1,
    chat: "pinjam seratus",
    pin: true,
    status: "unread",
  },
  {
    id: 12,
    from: 2,
    to: 1,
    chat: "SENDPICTURE|https://i.insider.com/602ee9d81a89f20019a377c6?width=1136&format=jpeg.",
    pin: false,
    status: "unread",
  },
];

// Endpoint
app.get("/test", (req, res) => {
  return res.send("Backend Praktikum FPW Minggu 6");
});

app.get("/api/users", (req, res) => {
  let { username } = req.query;

  if (username) {
    const result = users.find((u) => u.username === username);
    return res.status(200).send(result);
  } else {
    return res.status(200).send(users);
  }
});

app.get("/api/users/:id", (req, res) => {
  let { id } = req.params;

  if (id) {
    const result = users.find((u) => u.id === Number(id));
    return res.status(200).send(result);
  }
});

app.post("/api/users", (req, res) => {
  let { username, password, phoneNumber, token } = req.body;

  if (token) {
    // GetUserByToken
    try {
      const id = jwt.verify(token, JWT_KEY);

      const user = users.find((u) => u.id == id.id);
      return res.status(200).send(user);
    } catch (error) {
      return res.status(404).send("notFound");
    }
  } else {
    let newId = users[users.length - 1].id + 1;

    let newData = {
      id: newId,
      username: username,
      password: password,
      phoneNumber: phoneNumber,
      friends: [],
    };

    users.push(newData);

    return res.status(201).send(newData);
  }
});

app.put("/api/users/:id/add", (req, res) => {
  let { id } = req.params;
  let { friendId } = req.body;

  let user = users.find((u) => u.id == id);
  user.friends.push(Number(friendId));

  let friendUser = users.find((u) => u.id == friendId);
  friendUser.friends.push(Number(id));

  return res.status(201).send("Updated");
});

app.post("/api/login", async (req, res) => {
  let { id } = req.body;

  let token = jwt.sign(
    {
      id: id,
    },
    JWT_KEY
  );

  return res.status(201).send(token);
});

app.get("/api/chats", (req, res) => {
  return res.status(200).send(chats);
});

app.get("/api/chats/:Id", (req, res) => {
  let { Id } = req.params;
  if (Id) {
    let result = chats.find((c) => c.id == Number(Id));

    return res.status(200).send(result);
  }
});

app.post("/api/chats", (req, res) => {
  let { from, to, chat } = req.body;

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

  chats.push(result);

  return res.status(201).send(result);
});

app.put("/api/chats/:Id/pin", (req, res) => {
  let { Id } = req.params;
  if (Id) {
    let result = chats.find((c) => c.id == Number(Id));
    result.pin = !result.pin;
    return res.status(201).send(result);
  }
});

app.put("/api/chats/status", (req, res) => {
  let { userId, friendId } = req.body;

  const userChats = chats.filter((c) => c.from == userId || c.to == userId);
  const currentChats = userChats.filter(
    (c) => c.from == friendId || c.to == friendId
  );

  currentChats.forEach((c) => {
    c.status = "read";
  });

  return res.status(201).send(currentChats);
});

app.delete("/api/chats/:Id", (req, res) => {
  let { Id } = req.params;
  let result = chats.filter((c) => c.id != Id);
  chats = result;
  return res.status(201).send(chats);
});

// Listening
app.listen(app.get("port"), () => {
  console.log(`Server started at http://localhost:${app.get("port")}`);
});

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // in production restrict this to your frontend domain
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {}; // socketId -> {username, id}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // When a user joins with a username
  socket.on("join", (username) => {
    onlineUsers[socket.id] = { username };
    // notify this socket with current users
    io.emit("users", Object.values(onlineUsers).map(u => u.username));
    // broadcast join message
    socket.broadcast.emit("message", {
      system: true,
      text: `${username} has joined the chat`,
      time: Date.now(),
    });
  });

  // When a message is sent
  socket.on("sendMessage", (msgObj) => {
    // msgObj: { username, text }
    const payload = {
      username: msgObj.username,
      text: msgObj.text,
      time: Date.now(),
    };
    io.emit("message", payload);
  });

  // Optionally handle typing events
  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", username);
  });

  socket.on("stopTyping", (username) => {
    socket.broadcast.emit("stopTyping", username);
  });

  // Disconnect
  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      const username = user.username;
      delete onlineUsers[socket.id];
      io.emit("users", Object.values(onlineUsers).map(u => u.username));
      socket.broadcast.emit("message", {
        system: true,
        text: `${username} has left the chat`,
        time: Date.now(),
      });
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// simple health route
app.get("/", (req, res) => res.send("Socket.io chat server running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));


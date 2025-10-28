import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Change to your backend URL if needed
const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL);

export default function Chat() {
  const [username, setUsername] = useState("");
  const [entered, setEntered] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const messagesRef = useRef();

  useEffect(() => {
    // receive messages
    socket.on("message", (msg) => {
      setMessages((m) => [...m, msg]);
    });

    // receive user list
    socket.on("users", (userList) => {
      setUsers(userList);
    });

    socket.on("typing", (name) => {
      setTypingUser(name);
    });

    socket.on("stopTyping", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("message");
      socket.off("users");
      socket.off("typing");
      socket.off("stopTyping");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const joinChat = () => {
    if (!username.trim()) return;
    socket.connect(); // ensure connected
    socket.emit("join", username);
    setEntered(true);
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    const payload = { username, text: messageText };
    socket.emit("sendMessage", payload);
    setMessages((m) => [...m, { ...payload, time: Date.now() }]);
    setMessageText("");
    socket.emit("stopTyping", username);
  };

  let typingTimeout = useRef(null);
  const handleTyping = (val) => {
    setMessageText(val);
    if (!val) {
      socket.emit("stopTyping", username);
      return;
    }
    socket.emit("typing", username);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", username);
    }, 900);
  };

  if (!entered) {
    return (
      <div style={styles.centered}>
        <h2>Join Chat</h2>
        <input
          style={styles.input}
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") joinChat(); }}
        />
        <button style={styles.button} onClick={joinChat}>Enter</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3>Online</h3>
        <ul style={{ paddingLeft: 10 }}>
          {users.map((u, i) => <li key={i}>{u}</li>)}
        </ul>
      </div>

      <div style={styles.chatArea}>
        <div style={styles.messages} ref={messagesRef}>
          {messages.map((m, idx) => (
            <div key={idx} style={m.system ? styles.systemMsg : styles.msg}>
              {!m.system && <strong>{m.username}: </strong>}
              <span style={{ marginLeft: m.system ? 0 : 6 }}>{m.text}</span>
              <div style={styles.time}>
                {new Date(m.time).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.typingArea}>
          {typingUser && <em>{typingUser} is typing...</em>}
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.messageInput}
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          />
          <button style={styles.sendButton} onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  centered: {
    display: "flex", flexDirection: "column", alignItems: "center", marginTop: 80
  },
  input: { padding: 8, fontSize: 16, marginBottom: 10, width: 240 },
  button: { padding: "8px 12px", fontSize: 16, cursor: "pointer" },

  container: { display: "flex", height: "100vh" },
  sidebar: { width: 200, borderRight: "1px solid #ddd", padding: 16 },
  chatArea: { flex: 1, display: "flex", flexDirection: "column" },
  messages: { flex: 1, padding: 16, overflowY: "auto", background: "#f9f9f9" },
  msg: { marginBottom: 12, padding: 8, borderRadius: 6, background: "#fff", boxShadow: "0 0 0 1px #eee inset" },
  systemMsg: { marginBottom: 12, padding: 8, borderRadius: 6, background: "#fff7e6", color: "#555" },
  time: { fontSize: 10, color: "#999", marginTop: 6 },
  typingArea: { minHeight: 20, padding: "0 16px", fontStyle: "italic", color: "#555" },
  inputRow: { display: "flex", borderTop: "1px solid #eee", padding: 12 },
  messageInput: { flex: 1, padding: 8, fontSize: 16 },
  sendButton: { marginLeft: 8, padding: "8px 12px", cursor: "pointer" },
};


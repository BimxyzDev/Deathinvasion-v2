// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import accounts from "./account.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// token + chat id buat bot telegram
const TELEGRAM_TOKEN = "ISI_TOKEN_BOT_LU";
const CHAT_ID = "ISI_CHAT_ID_LU";

// simulasi command
const commands = [
  { type: "Crash Android", command: "/crashandro" },
  { type: "Crash iPhone", command: "/crashios" },
  { type: "Delay Android", command: "/delayandro" },
  { type: "Delay iPhone", command: "/delayios" }
];

// ========== LOGIN ==========
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = accounts.find(
    (acc) => acc.username === username && acc.password === password
  );

  if (!user) {
    return res.json({ success: false, message: "Username / password salah" });
  }

  const now = new Date();
  const expired = new Date(user.expired);

  if (now > expired) {
    return res.json({ success: false, message: "Akun sudah expired" });
  }

  res.json({
    success: true,
    username: user.username,
    expired: user.expired
  });
});

// ========== LOGOUT ==========
app.post("/api/logout", (req, res) => {
  res.json({ success: true });
});

// ========== COMMAND LIST ==========
app.get("/api/commands", (req, res) => {
  res.json({ success: true, commands });
});

// ========== SEND BUG ==========
app.post("/api/send-bug", async (req, res) => {
  const { number, type } = req.body;
  const cmd = commands.find((c) => c.type === type);

  if (!cmd) {
    return res.json({ success: false, message: "Command tidak ditemukan" });
  }

  const message = `${cmd.command} ${number}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    res.json({ success: true, message: "Bug terkirim ke Telegram" });
  } catch (e) {
    res.json({ success: false, message: "Gagal kirim ke Telegram" });
  }
});

// run server
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});

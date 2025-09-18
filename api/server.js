// api/account.js
export default function handler(req, res) {
  const accounts = [
    { username: "bima", password: "ganteng", expired: "2025-12-31" },
    { username: "user1", password: "12345", expired: "2025-10-01" },
  ];

  if (req.method === "POST") {
    const { username, password } = req.body;

    const acc = accounts.find(
      (a) => a.username === username && a.password === password
    );

    if (!acc) {
      return res
        .status(401)
        .json({ success: false, message: "❌ Username / password salah!" });
    }

    const now = new Date();
    const exp = new Date(acc.expired);

    if (now > exp) {
      return res
        .status(403)
        .json({ success: false, message: "⚠️ Akun sudah kadaluarsa!" });
    }

    return res.json({ success: true, message: "✅ Login berhasil!", account: acc });
  }

  res.status(405).json({ success: false, message: "Method tidak diizinkan" });
}

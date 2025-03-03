require("dotenv").config();
const express = require("express");
const session = require("express-session");
const axios = require("axios");

const app = express();
const PORT = 3333;

app.use(
  session({
    secret: "supersecretkey", // Change this to a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  }),
);

// 🔹 Replace with your Mastodon instance (e.g., mastodon.social)
const MASTODON_INSTANCE = "https://mastodon.social";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3333/callback"; // "urn:ietf:wg:oauth:2.0:oob";

app.get("/", (req, res) => {
  if (!req.session) {
    return res.send("Session not initialized");
  }

  const message = req.session.message || "";
  req.session.message = null; // Clear message after displaying

  res.send(`
    <h2>Mastodon OAuth Login</h2>
    ${message ? `<p style="color: red;">${message}</p>` : ""}
    <a href="/login"><button>Login with Mastodon</button></a>
  `);
});

// 1️⃣ Redirect user to Mastodon login
app.get("/login", (req, res) => {
  const authUrl = `${MASTODON_INSTANCE}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=read`;
  res.redirect(authUrl);
});

// 2️⃣ Handle OAuth callback
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.send("Error: No code received");

  try {
    // 3️⃣ Exchange code for an access token
    const response = await axios.post(
      `${MASTODON_INSTANCE}/oauth/token`,
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
          code: code,
        },
      },
    );

    const accessToken = response.data.access_token;

    // 4️⃣ Fetch user profile using the token
    req.session.accessToken = accessToken; // Store token in session

    // Fetch user profile
    const userResponse = await axios.get(
      `${MASTODON_INSTANCE}/api/v1/accounts/verify_credentials`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    req.session.user = userResponse.data; // Store user in session
    res.redirect("/dashboard"); // Redirect to protected page
  } catch (error) {
    res.status(500).send("OAuth Error: " + error.message);
  }
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/");

  const user = req.session.user;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
          .container { max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); }
          img { border-radius: 50%; width: 80px; height: 80px; }
          button { padding: 10px 15px; margin-top: 10px; cursor: pointer; border: none; background: red; color: white; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Welcome, ${user.username}!</h2>
            <p><b>Display Name:</b> ${user.display_name}</p>
            <img src="${user.avatar}" alt="Profile Picture">
            <br>
            <a href="/logout"><button>Logout</button></a>
        </div>
    </body>
    </html>
  `);
});

app.get("/logout", (req, res) => {
  if (!req.session) {
    return res.send("Session not initialized");
  }
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);

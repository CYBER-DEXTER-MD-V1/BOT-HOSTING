const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const { repo, apiKey, envVars } = req.body;

  try {
    const response = await axios.post("https://api.render.com/v1/services", {
      type: "web",
      name: "auto-deploy-" + Math.floor(Math.random() * 10000),
      repo,
      env: "node",
      buildCommand: "npm install",
      startCommand: "npm start",
      region: "oregon",
      envVars
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: err?.response?.data || err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

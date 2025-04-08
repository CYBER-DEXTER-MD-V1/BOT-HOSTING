const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();  // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// POST endpoint to handle deployment requests
app.post("/deploy", async (req, res) => {
  const { repo, envVars } = req.body;

  // Fetch the API key securely from environment variables
  const apiKey = process.env.RENDER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Render API key not found!" });
  }

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
        Authorization: `Bearer ${apiKey}`, // Use the stored API key here
        "Content-Type": "application/json"
      }
    });

    // Send back the response from Render API
    res.json(response.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: err?.response?.data || err.message });
  }
});

// Start the server
app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));

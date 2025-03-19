require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const axios = require("axios");
const serviceAccount = require("./firebase-admin.json");

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-firebase-project.firebaseio.com",
});

// Firestore Database
const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// 🟢 Route to Start a Call via Vapi.ai
app.post("/start-call", async (req, res) => {
  try {
    const { phoneNumber } = req.body; // Caller’s number

    const response = await axios.post(
      "https://api.vapi.ai/v1/calls",
      {
        to: phoneNumber,
        assistant_id: process.env.ASSISTANT_ID,
      },
      {
        headers: { Authorization: `Bearer ${process.env.VAPI_API_KEY}` },
      }
    );

    res.json({ success: true, call_id: response.data.call_id });
  } catch (error) {
    console.error("Error starting call:", error);
    res.status(500).json({ success: false, message: "Call failed" });
  }
});

// 🟢 Webhook Route to Capture Call Transcripts
app.post("/webhook", async (req, res) => {
  try {
    const { call_id, transcript, speaker, timestamp } = req.body;

    // Store call transcript in Firebase
    await db.collection("call_transcripts").doc(call_id).set({
      call_id,
      transcript,
      speaker,
      timestamp,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving transcript:", error);
    res.status(500).json({ success: false });
  }
});

// 🟢 Test Route
app.get("/", (req, res) => {
  res.send("🔥 ResQAI Backend is Running with Firebase & Vapi.ai!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

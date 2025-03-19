require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const axios = require("axios");


const app = express();
const PORT = process.env.PORT || 5000;


const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore Database
const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 Middleware to Verify Vapi.ai Webhook Requests
const verifyVapiRequest = (req, res, next) => {
  const vapiSecret = process.env.VAPI_SECRET; // Set in .env
  const receivedSecret = req.headers["x-vapi-secret"];

  if (vapiSecret && receivedSecret !== vapiSecret) {
    console.error("❌ Unauthorized webhook request");
    return res.status(403).json({ error: "Unauthorized request" });
  }
  next();
};

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

    console.log("✅ Call started with ID:", response.data.call_id);
    res.json({ success: true, call_id: response.data.call_id });
  } catch (error) {
    console.error("❌ Error starting call:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Call failed" });
  }
});

// 🟢 Webhook Route to Capture Call Transcripts
app.post("/webhook", verifyVapiRequest, async (req, res) => {
  try {
    console.log("📞 Received webhook event:", req.body);

    const { call_id, transcript, speaker, timestamp, type } = req.body;

    if (!call_id) {
      console.error("❌ Invalid webhook data: Missing call_id");
      return res.status(400).json({ error: "Invalid data" });
    }

    if (type === "call_completed") {
      console.log(`✅ Call ${call_id} completed.`);
    } else if (type === "message") {
      console.log(`💬 Message from ${speaker}: ${transcript}`);
    }

    // Store call transcript in Firebase
    await db.collection("call_transcripts").doc(call_id).set({
      call_id,
      transcript,
      speaker,
      timestamp,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving transcript:", error.message);
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

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const admin = require("firebase-admin");
// const axios = require("axios");

// const app = express();
// const PORT = process.env.PORT || 5000;

// console.log("🔥 Starting ResQAI Backend...");

// // 🔹 Validate Environment Variables
// if (!process.env.FIREBASE_ADMIN_CREDENTIALS) {
//   console.error("❌ FIREBASE_ADMIN_CREDENTIALS is missing in .env");
//   process.exit(1);
// }
// if (!process.env.VAPI_SECRET) {
//   console.warn("⚠️ Warning: VAPI_SECRET is missing in .env");
// }
// if (!process.env.VAPI_API_KEY) {
//   console.warn("⚠️ Warning: VAPI_API_KEY is missing in .env");
// }

// // 🔹 Parse Firebase Credentials
// let serviceAccount;
// try {
//   serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
//   console.log("✅ Firebase credentials parsed successfully");
// } catch (error) {
//   console.error("❌ Error parsing FIREBASE_ADMIN_CREDENTIALS:", error.message);
//   process.exit(1);
// }

// // 🔹 Initialize Firebase Admin SDK
// try {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
//   console.log("✅ Firebase initialized successfully");
// } catch (error) {
//   console.error("❌ Firebase initialization error:", error.message);
//   process.exit(1);
// }

// // Firestore Database
// const db = admin.firestore();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // 🔹 Middleware to Verify Vapi.ai Webhook Requests
// const verifyVapiRequest = (req, res, next) => {
//   const vapiSecret = process.env.VAPI_SECRET; // Set in .env
//   const receivedSecret = req.headers["x-vapi-secret"];

//   if (vapiSecret && receivedSecret !== vapiSecret) {
//     console.error("❌ Unauthorized webhook request");
//     return res.status(403).json({ error: "Unauthorized request" });
//   }
//   next();
// };

// // 🟢 Route to Start a Call via Vapi.ai
// app.post("/start-call", async (req, res) => {
//   try {
//     let { phoneNumber } = req.body; // Customer's number

//     if (!phoneNumber || !/^\+\d{10,15}$/.test(phoneNumber)) {
//       console.error("❌ Invalid phoneNumber format");
//       return res.status(400).json({ success: false, message: "Invalid phone number. Must be in E.164 format (e.g., +14155552671)." });
//     }

//     console.log("📞 Initiating call to:", phoneNumber);

//     const response = await axios.post(
//       "https://api.vapi.ai/call/phone",
//       {
//         assistant: {
//           firstMessage: "Hello, this is the emergency response center. How can I assist you?",
//           model: {
//             provider: "openai",
//             model: "gpt-3.5-turbo",
//             messages: [
//               {
//                 role: "system",
//                 content: "You are an AI Emergency Operator responsible for assisting callers in distress..."
//               }
//             ]
//           },
//           voice: "jennifer-playht"
//         },
//         phoneNumberId: process.env.PHONE_NUMBER_ID, // Ensure this is set correctly
//         customer: { number: phoneNumber }
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     console.log("✅ Call started with ID:", response.data.id);
//     res.json({ success: true, call_id: response.data.id });
//   } catch (error) {
//     console.error("❌ Error starting call:", error.response?.data || error.message);
//     res.status(500).json({ success: false, message: "Call failed" });
//   }
// });





// // 🟢 Webhook Route to Capture Call Transcripts
// app.post("/webhook", verifyVapiRequest, async (req, res) => {
//   try {
//     console.log("📞 Received webhook event:", JSON.stringify(req.body, null, 2));

//     const { call_id, transcript, speaker, timestamp, type } = req.body;

//     if (!call_id) {
//       console.error("❌ Invalid webhook data: Missing call_id");
//       return res.status(400).json({ error: "Invalid data" });
//     }

//     if (type === "call_completed") {
//       console.log(`✅ Call ${call_id} completed.`);
//     } else if (type === "message") {
//       console.log(`💬 Message from ${speaker}: ${transcript}`);
//     }

//     // Check Firestore connection
//     if (!db) {
//       console.error("❌ Firestore database is not initialized");
//       return res.status(500).json({ success: false, message: "Database error" });
//     }

//     // Store call transcript in Firebase
//     console.log("📝 Saving transcript to Firestore...");
//     await db.collection("call_transcripts").doc(call_id).set(
//       {
//         call_id,
//         transcript,
//         speaker,
//         timestamp,
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       },
//       { merge: true }
//     );
//     console.log("✅ Transcript saved successfully for Call ID:", call_id);

//     res.json({ success: true });
//   } catch (error) {
//     console.error("❌ Error saving transcript:", error.message);
//     res.status(500).json({ success: false });
//   }
// });

// // 🟢 Test Route
// app.get("/", (req, res) => {
//   res.send("🔥 ResQAI Backend is Running with Firebase & Vapi.ai!");
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });


// require("dotenv").config();
// const express = require("express");
// const admin = require("firebase-admin");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // 🔹 Initialize Firebase
// const serviceAccount = require("./firebase-admin.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();

// // 🔹 Initialize Gemini API
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const app = express();
// app.use(express.json());

// /**
//  * 1️⃣ Store Call Transcripts in Firebase
//  */
// app.post("/store-transcript", async (req, res) => {
//   try {
//     const { call_id, transcript } = req.body;

//     if (!call_id || !Array.isArray(transcript) || transcript.length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const transcriptRef = db.collection("call_transcripts").doc(call_id);
//     const transcriptDoc = await transcriptRef.get();

//     let transcriptData = [];
//     if (transcriptDoc.exists) {
//       transcriptData = transcriptDoc.data().messages || [];
//     }

//     transcriptData.push(...transcript);

//     await transcriptRef.set({ messages: transcriptData });

//     console.log(`✅ Stored transcript for Call ID: ${call_id}`);
//     res.status(200).json({ message: "Transcript stored successfully" });
//   } catch (error) {
//     console.error("❌ Error storing transcript:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// /**
//  * 2️⃣ Extract Emergency Details (NER Tagging)
//  */
// async function extractEmergencyDetails(callId, transcript) {
//   try {
//     console.log(`🔍 Extracting emergency details for Call ID: ${callId}...`);

//     const fullText = transcript.map(entry => entry.message).join(" ");

//     const prompt = `
//       Extract the following details from this emergency call transcript:
//       - Location of emergency
//       - Type of emergency
//       - Criticality (Low, Medium, High)
//       - Approximate number of casualties
//       Respond in JSON format:
//       {"location": "...", "type_of_emergency": "...", "criticality": "...", "approximate_casualties": ...}
      
//       Transcript: "${fullText}"
//     `;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     console.log("🔍 NER Response:", responseText);

//     try {
//       return JSON.parse(responseText);
//     } catch (parseError) {
//       console.error("❌ Error parsing NER response:", parseError);
//       return {
//         location: "Unknown",
//         type_of_emergency: "Unknown",
//         criticality: "Unknown",
//         approximate_casualties: 0,
//       };
//     }
//   } catch (error) {
//     console.error("❌ Error in NER Extraction:", error.message);
//     return {
//       location: "Unknown",
//       type_of_emergency: "Unknown",
//       criticality: "Unknown",
//       approximate_casualties: 0,
//     };
//   }
// }

// /**
//  * 3️⃣ Emotion Detection on Call Transcripts
//  */
// async function detectEmotion(callId, transcript) {
//   try {
//     console.log(`🔍 Performing Emotion Detection for Call ID: ${callId}...`);

//     const callerMessages = transcript
//       .filter(entry => entry.speaker === "caller")
//       .map(entry => entry.message)
//       .join(" ");

//     if (!callerMessages) {
//       console.warn("⚠️ No caller messages found for emotion detection.");
//       return { emotion: "Neutral", confidence: 1.0 };
//     }

//     const prompt = `
//       Analyze the following emergency call transcript and classify the caller's emotion.
//       Possible emotions: Panic, Fear, Calm, Angry, Sad, Neutral.
//       Respond in JSON format: {"emotion": "<label>", "confidence": <0-1>}.

//       Transcript: "${callerMessages}"
//     `;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     console.log("🔍 Emotion Analysis Response:", responseText);

//     try {
//       return JSON.parse(responseText);
//     } catch (parseError) {
//       console.error("❌ Error parsing Emotion Detection response:", parseError);
//       return { emotion: "Unknown", confidence: 0.0 };
//     }
//   } catch (error) {
//     console.error("❌ Error in Emotion Detection:", error.message);
//     return { emotion: "Error", confidence: 0.0 };
//   }
// }

// /**
//  * 4️⃣ Process Completed Call (NER + Emotion Analysis + Store in Firebase)
//  */
// app.post("/process-completed-call", async (req, res) => {
//   try {
//     const { call_id } = req.body;

//     if (!call_id) {
//       return res.status(400).json({ error: "Missing call_id" });
//     }

//     const transcriptDoc = await db.collection("call_transcripts").doc(call_id).get();
//     if (!transcriptDoc.exists) {
//       return res.status(404).json({ error: "Call transcript not found" });
//     }
//     const transcript = transcriptDoc.data().messages;

//     const emergencyDetails = await extractEmergencyDetails(call_id, transcript);
//     const emotionResult = await detectEmotion(call_id, transcript);

//     await db.collection("emergencies").doc(call_id).set(
//       {
//         ...emergencyDetails,
//         emotion_analysis: {
//           caller_emotion: emotionResult.emotion,
//           confidence_score: emotionResult.confidence,
//         },
//       },
//       { merge: true }
//     );

//     console.log(`🚀 Emergency details & emotion analysis stored for Call ID: ${call_id}`);
//     res.status(200).json({ message: "Processed successfully", call_id });
//   } catch (error) {
//     console.error("❌ Error processing completed call:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });




require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🔹 Initialize Firebase



const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 🔹 Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(express.json());

/**
 * 1️⃣ Store Call Transcripts in Firebase
 */
app.post("/store-transcript", async (req, res) => {
  try {
    const { call_id, message, speaker, timestamp } = req.body;

    if (!call_id || !message || !speaker || !timestamp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transcriptRef = db.collection("call_transcripts").doc(call_id);
    const transcriptDoc = await transcriptRef.get();

    let transcriptData = [];
    if (transcriptDoc.exists) {
      transcriptData = transcriptDoc.data().messages || [];
    }

    transcriptData.push({ message, speaker, timestamp });

    await transcriptRef.set({ messages: transcriptData });

    console.log(`✅ Stored transcript for Call ID: ${call_id}`);
    res.status(200).json({ message: "Transcript stored successfully" });
  } catch (error) {
    console.error("❌ Error storing transcript:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 2️⃣ Extract Emergency Details (NER Tagging)
 */
async function extractEmergencyDetails(callId, transcript) {
  try {
    console.log(`🔍 Extracting emergency details for Call ID: ${callId}...`);

    const fullText = transcript.map(entry => entry.message).join(" ");

    const prompt = `
      Extract the following details from this emergency call transcript:
      - Location of emergency
      - Type of emergency
      - Criticality (Low, Medium, High)
      - Approximate number of casualties
      Respond in JSON format:
      {"location": "...", "type_of_emergency": "...", "criticality": "...", "approximate_casualties": ...}
      
      Transcript: "${fullText}"
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().replace(/```json|```/g, "").trim();

    console.log("🔍 NER Response:", responseText);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("❌ Error in NER Extraction:", error.message);
    return {
      location: "Unknown",
      type_of_emergency: "Unknown",
      criticality: "Unknown",
      approximate_casualties: 0,
    };
  }
}

/**
 * 3️⃣ Emotion Detection on Call Transcripts
 */
async function detectEmotion(callId, transcript) {
  try {
    console.log(`🔍 Performing Emotion Detection for Call ID: ${callId}...`);

    const callerMessages = transcript
      .filter(entry => entry.speaker === "caller")
      .map(entry => entry.message)
      .join(" ");

    if (!callerMessages) {
      console.warn("⚠️ No caller messages found for emotion detection.");
      return { emotion: "Neutral", confidence: 1.0 };
    }

    const prompt = `
      Analyze the following emergency call transcript and classify the caller's emotion.
      Possible emotions: Panic, Fear, Calm, Angry, Sad, Neutral.
      Respond in JSON format: {"emotion": "<label>", "confidence": <0-1>}.
      
      Transcript: "${callerMessages}"
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().replace(/```json|```/g, "").trim();

    console.log("🔍 Emotion Analysis Response:", responseText);
    return JSON.parse(responseText);
  } catch (error) {
    console.error("❌ Error in Emotion Detection:", error.message);
    return { emotion: "Error", confidence: 0.0 };
  }
}

/**
 * 4️⃣ Process Completed Call (NER + Emotion Analysis + Store in Firebase)
 */
app.post("/process-completed-call", async (req, res) => {
  try {
    const { call_id } = req.body;

    if (!call_id) {
      return res.status(400).json({ error: "Missing call_id" });
    }

    const transcriptDoc = await db.collection("call_transcripts").doc(call_id).get();
    if (!transcriptDoc.exists) {
      return res.status(404).json({ error: "Call transcript not found" });
    }
    const transcript = transcriptDoc.data().messages;

    const emergencyDetails = await extractEmergencyDetails(call_id, transcript);
    const emotionResult = await detectEmotion(call_id, transcript);

    await db.collection("emergencies").doc(call_id).set(
      {
        ...emergencyDetails,
        emotion_analysis: {
          caller_emotion: emotionResult.emotion,
          confidence_score: emotionResult.confidence,
        },
      },
      { merge: true }
    );

    console.log(`🚀 Emergency details & emotion analysis stored for Call ID: ${call_id}`);
    res.status(200).json({ message: "Processed successfully", call_id });
  } catch (error) {
    console.error("❌ Error processing completed call:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

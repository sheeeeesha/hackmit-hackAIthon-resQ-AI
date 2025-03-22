# ResQAI - Emergency Response System

ResQAI is an innovative emergency response system designed to streamline and expedite the handling of emergency calls. It leverages AI-powered voice transcription, natural language processing, and emotion analysis to extract critical information from caller conversations and provide real-time updates to emergency responders.

## Features

-   **AI-Powered Voice Transcription:** Real-time transcription of emergency calls using Vapi.ai.
-   **Named Entity Recognition (NER):** Automatic extraction of crucial details such as location, type of emergency, and number of casualties.
-   **Emotion Analysis:** Detection of caller's emotional state to prioritize and understand the urgency of the situation.
-   **Real-Time Dashboard:** Interactive dashboard displaying active emergencies with location mapping and transcript details.
-   **Firebase Integration:** Secure and scalable data storage using Google Firestore.
-   **Seamless Deployment:** Backend deployed on Render, and frontend deployed on Vercel.

## Technologies Used

-   **Backend:**
    -   Node.js
    -   Express.js
    -   Firebase Admin SDK
    -   Google Gemini API
    -   Render (deployment)
-   **Frontend:**
    -   Next.js (React)
    -   React Leaflet
    -   Firebase SDK
    -   Vercel (deployment)
-   **AI Services:**
    -   Vapi.ai (voice transcription)
    -   Google Gemini API (NER and emotion analysis)
-   **Database:**
    -   Google Firestore

## Setup Instructions

### Backend (Render)

1.  **Clone the Repository:**
    ```bash
    git clone <your-github-repo-url>
    cd resqai-backend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Set Environment Variables:**
    -   Create a `.env` file in the root directory.
    -   Add the following environment variables:
        ```
        FIREBASE_ADMIN_CREDENTIALS=<your-firebase-admin-credentials-json>
        GEMINI_API_KEY=<your-gemini-api-key>
        PORT=5000 (or any port you prefer)
        ```
    -   Replace `<your-firebase-admin-credentials-json>` and `<your-gemini-api-key>` with your actual credentials.
4.  **Deploy to Render:**
    -   Create a Render account.
    -   Connect your GitHub repository to Render.
    -   Configure the following settings:
        -   **Build Command:** `npm install && node server.js`
        -   **Port:** The port specified in your `.env` file (e.g., 5000).
5.  **Access the Backend:**
    -   Once deployed, Render will provide a URL for your backend.

### Frontend (Vercel)

1.  **Clone the Repository:**
    ```bash
    git clone <your-github-repo-url>
    cd resqai-frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Set Environment Variables:**
    -   Create a `.env.local` file in the root directory.
    -   Add your firebase config variables.
        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=<your_api_key>
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_project_id>
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_storage_bucket>
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_messaging_sender_id>
        NEXT_PUBLIC_FIREBASE_APP_ID=<your_app_id>
        ```
4.  **Deploy to Vercel:**
    -   Create a Vercel account.
    -   Connect your GitHub repository to Vercel.
    -   Vercel will automatically detect the Next.js project and configure the necessary settings.
5.  **Access the Frontend:**
    -   Once deployed, Vercel will provide a URL for your frontend dashboard.

## Usage

1.  **Simulate Emergency Calls:**
    -   Use Postman or cURL to send POST requests to the `/store-transcript` endpoint on your Render backend.
    -   Simulate the "call completed" event by sending a POST request to the `/process-completed-call` endpoint.
2.  **View Emergencies on Dashboard:**
    -   Open the frontend dashboard URL provided by Vercel.
    -   View active emergencies, filter them, and select an emergency to see detailed information.

## Team Contributions

* **Ashish Tamhankar:**
    * Developed the backend API endpoints for transcript processing.
    * Integrated Google Gemini API for NER and emotion analysis.
    * Handled the Firebase integration and database management.
    * Managed the Vercel deployment and frontend optimization.
* **Vinay Yadav:**
    * Designed and implemented the React-based frontend dashboard.
    * Integrated React Leaflet for map visualization.
    * Helped with project documentation
* **Chinmay Jadhav:**
    * Researched and integrated the Vapi.ai API for real-time transcription.
    * Conducted thorough testing and debugging of the system.
    * Helped with the project documentation.

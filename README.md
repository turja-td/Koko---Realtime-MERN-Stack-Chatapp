# Koko - Real-Time Chat Application

Koko is a full-stack instant messaging platform built with the MERN stack. It features real-time communication, interactive media sharing, and a responsive UI.

## Features

- **Real-time Messaging:** Powered by Socket.io for instant message delivery.
- **Media Handling:** Send, preview (full-screen), and download images securely.
- **Read Receipts:** Track when messages are delivered and seen.
- **Smart UI:** Custom toast notifications, active status badges, and smooth navigation.

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, DaisyUI, Zustand
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time:** Socket.io
- **Media Storage:** Cloudinary

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/turja-td/Koko---Realtime-MERN-Stack-Chatapp.git
```

2. Install dependencies and build:
```bash
   npm run build
```

3. Set up environment variables. Create a `.env` file in your `backend` folder and add:
   - `MONGODB_URI`
   - `PORT`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NODE_ENV`

4. Start the application:
```bash
   npm start
```

---

Developed by [Turja](https://github.com/turja-td).
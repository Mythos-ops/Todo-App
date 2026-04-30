# 📝 Full-Stack Todo Application

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Here-blue?style=for-the-badge)](https://todo-app-c4u2.onrender.com)

A clean, fast, and responsive full-stack Todo application built with React, Express.js, and a local JSON database. This project demonstrates core CRUD operations (Create, Read, Update, Delete) utilizing a modern client-server architecture.

---

## 🚀 Live Demo

Experience the application live here: **[https://todo-app-c4u2.onrender.com](https://todo-app-c4u2.onrender.com)**

---

## ✨ Features

- **Create** new todo items effortlessly.
- **Read/View** all your current tasks.
- **Update** existing tasks by editing their text.
- **Mark Complete/Incomplete** to track progress.
- **Delete** tasks that are no longer needed.
- **Seamless Local Persistence** via a file-based JSON store.

---

## 🛠️ Technologies Used

### Frontend
- **React 19**
- **Vite** (Build tool & development server)
- Modern UI Design / CSS

### Backend
- **Node.js**
- **Express.js** (REST API)
- **Local JSON Storage** (`server/data/todos.json`)

---

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone or download the project folder:**
   ```bash
   cd Todo-App
   ```

2. **Install all dependencies** (this covers both the React client and Express server):
   ```bash
   npm install
   ```

---

## 🏃 Running the App

### Development Mode

To run both the frontend and backend servers simultaneously with live-reloading:

```bash
npm run dev
```

- The Express backend runs on `http://localhost:5000` (using Nodemon).
- The Vite frontend runs locally (check your terminal for the exact `localhost` port, usually `5173`).

### Production Build

To build the client application and run it as a production server:

1. **Build the React frontend:**
   ```bash
   npm run build
   ```
   *This compiles the React code and outputs static files directly to the server folder.*

2. **Start the production server:**
   ```bash
   npm start
   ```

The backend now serves the built frontend from its public directory, exactly how it runs on Render.

---

## 📂 Project Structure

- `/client` - The Vite-powered React frontend application.
- `/server` - The Express backend API.
  - `/server/index.js` - Main server entry point.
  - `/server/data/todos.json` - File-based local database.
- `package.json` - Root configuration for concurrent scripts.

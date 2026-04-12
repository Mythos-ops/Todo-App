# Todo App

A simple full-stack todo application built with React, Express, and a local JSON database.

## Features

- Create todo items
- View all todos
- Mark todos as completed
- Edit todo text
- Delete todos

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The frontend runs with Vite and the backend runs on `http://localhost:5000`.

## Production

Build the client:

```bash
npm run build
```

Then start the server:

```bash
npm start
```

The backend serves the built frontend from `server/public`.

The todo data is stored in `server/data/todos.json`.

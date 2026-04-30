import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import todoRoutes from './routes/todos.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.resolve(__dirname, '../server/public');

app.use(cors());
app.use(express.json());

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/todos', todoRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));

  app.get('*', (request, response) => {
    response.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.use((error, request, response, next) => {
  console.error(error);
  const status = error.status || 500;
  response.status(status).json({
    message: error.message || 'Something went wrong.',
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


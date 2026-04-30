import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.join(__dirname, 'data');
const dataFilePath = path.join(dataDirectory, 'todos.json');

async function ensureStore() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, '[]', 'utf8');
  }
}

export async function readTodos() {
  await ensureStore();
  const rawData = await fs.readFile(dataFilePath, 'utf8');

  try {
    const todos = JSON.parse(rawData || '[]');
    return Array.isArray(todos) ? todos : [];
  } catch {
    return [];
  }
}

export async function writeTodos(todos) {
  await ensureStore();
  await fs.writeFile(dataFilePath, JSON.stringify(todos, null, 2), 'utf8');
}


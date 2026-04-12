import express from 'express';
import { randomUUID } from 'crypto';
import { readTodos, writeTodos } from '../storage.js';

const router = express.Router();

function sortTodos(todos) {
  return [...todos].sort((firstTodo, secondTodo) => {
    return new Date(secondTodo.createdAt) - new Date(firstTodo.createdAt);
  });
}

router.get('/', async (request, response, next) => {
  try {
    const todos = await readTodos();
    response.json(sortTodos(todos));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    const text = (request.body.text || '').trim();

    if (!text) {
      return response.status(400).json({ message: 'Todo text is required.' });
    }

    const todos = await readTodos();
    const now = new Date().toISOString();
    const todo = {
      id: randomUUID(),
      text,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    todos.push(todo);
    await writeTodos(todos);

    response.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (request, response, next) => {
  try {
    const { id } = request.params;
    const todos = await readTodos();
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return response.status(404).json({ message: 'Todo not found.' });
    }

    const updates = { ...todos[todoIndex] };

    if (typeof request.body.text === 'string') {
      const text = request.body.text.trim();

      if (!text) {
        return response.status(400).json({ message: 'Todo text cannot be empty.' });
      }

      updates.text = text;
    }

    if (typeof request.body.completed === 'boolean') {
      updates.completed = request.body.completed;
    }

    updates.updatedAt = new Date().toISOString();
    todos[todoIndex] = updates;

    await writeTodos(todos);

    response.json(updates);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (request, response, next) => {
  try {
    const { id } = request.params;

    const todos = await readTodos();
    const remainingTodos = todos.filter((todo) => todo.id !== id);

    if (remainingTodos.length === todos.length) {
      return response.status(404).json({ message: 'Todo not found.' });
    }

    await writeTodos(remainingTodos);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  text: '',
  completed: false,
};

function getTodoId(todo) {
  return todo.id ?? todo._id;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.');
  }

  return data;
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  async function loadTodos() {
    try {
      setLoading(true);
      setError('');
      const data = await requestJson('/api/todos');
      setTodos(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const text = form.text.trim();
    if (!text) {
      setError('Please enter a todo title.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      if (editingId) {
        const updatedTodo = await requestJson(`/api/todos/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ text }),
        });

        setTodos((currentTodos) =>
          currentTodos.map((todo) => (getTodoId(todo) === editingId ? updatedTodo : todo))
        );
        setMessage('Todo updated.');
      } else {
        const newTodo = await requestJson('/api/todos', {
          method: 'POST',
          body: JSON.stringify({ text }),
        });

        setTodos((currentTodos) => [newTodo, ...currentTodos]);
        setMessage('Todo added.');
      }

      resetForm();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(todo) {
    setEditingId(getTodoId(todo));
    setForm({ text: todo.text, completed: todo.completed });
    setError('');
    setMessage('');
  }

  async function handleToggle(todo) {
    try {
      setError('');
      const todoId = getTodoId(todo);
      const updatedTodo = await requestJson(`/api/todos/${todoId}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !todo.completed }),
      });

      setTodos((currentTodos) =>
        currentTodos.map((item) => (getTodoId(item) === todoId ? updatedTodo : item))
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError('');
      await requestJson(`/api/todos/${id}`, { method: 'DELETE' });
      setTodos((currentTodos) => currentTodos.filter((todo) => getTodoId(todo) !== id));
      if (editingId === id) {
        resetForm();
      }
      setMessage('Todo deleted.');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <h1>Taskline</h1>
        </div>
        <div className="stats">
          <article>
            <strong>{todos.length}</strong>
            <span>Total</span>
          </article>
          <article>
            <strong>{completedCount}</strong>
            <span>Done</span>
          </article>
          <article>
            <strong>{todos.length - completedCount}</strong>
            <span>Open</span>
          </article>
        </div>
      </section>

      <section className="panel form-panel">
        <form className="todo-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              id="todo-text"
              type="text"
              value={form.text}
              onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))}
              placeholder="Write a task, goal, or reminder"
              maxLength={120}
            />
            <button type="submit" disabled={saving}>
              {editingId ? 'Update todo' : 'Add todo'}
            </button>
          </div>
          <div className="helper-row">
            {message ? <span className="success">{message}</span> : null}
          </div>
        </form>
      </section>

      {error ? <div className="alert">{error}</div> : null}

      <section className="panel list-panel">
        <div className="panel-head">
          <button type="button" className="ghost" onClick={loadTodos}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="empty">Loading todos...</p>
        ) : todos.length === 0 ? (
          <p className="empty">No todos yet. Add the first one above.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={getTodoId(todo)} className={todo.completed ? 'todo-item done' : 'todo-item'}>
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                  />
                  <span>{todo.text}</span>
                </label>
                <div className="actions">
                  <button type="button" className="ghost" onClick={() => handleEdit(todo)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(getTodoId(todo))}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingId ? (
        <button type="button" className="floating-cancel" onClick={resetForm}>
          Cancel edit
        </button>
      ) : null}
    </main>
  );
}

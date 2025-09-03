import React, { useState } from 'react';
import api from '../api';

export default function TaskForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');

    try {
      const payload = { ...form };

      if (payload.dueDate) {
        const due = new Date(payload.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (due < today) {
          alert('Due date already expired. Please enter a valid future date.');
          setBusy(false);
          return;
        }
      } else {
        delete payload.dueDate;
      }

      await api.post('/api/tasks', payload);

      setForm({ title: '', description: '', dueDate: '' });
      onCreated?.();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to create task');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Add Task</h2>

      <div className="row" style={{ marginBottom: 8 }}>
        <input
          className="col"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div className="row" style={{ marginBottom: 8 }}>
        <textarea
          className="col"
          placeholder="Description"
          rows="2"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        ></textarea>
      </div>

      <div className="row" style={{ marginBottom: 8 }}>
        <input
          type="date"
          className="col"
          value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
        />
      </div>

      {err && <p style={{ color: '#fca5a5' }}>{err}</p>}

      <button className="primary" disabled={busy}>
        {busy ? 'Saving...' : 'Add Task'}
      </button>
    </form>
  );
}

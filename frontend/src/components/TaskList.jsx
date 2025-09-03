import React, { useState } from 'react';
import api from '../api';

export default function TaskList({ tasks, onChange }) {
  if (!tasks.length) return <p>No tasks yet. Add one above 👆</p>;
  return (
    <div>
      {tasks.map(t => <TaskRow key={t._id} task={t} onChange={onChange} />)}
    </div>
  );
}

function TaskRow({ task, onChange }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    title: task.title, description: task.description || '', dueDate: task.dueDate ? task.dueDate.slice(0,10) : ''
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const toggle = async () => {
    await api.patch(`/api/tasks/${task._id}/toggle`);
    onChange?.();
  };

  const del = async () => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/api/tasks/${task._id}`);
    onChange?.();
  };

  const save = async (e) => {
    e?.preventDefault();
    setBusy(true); setErr('');
    try {
      const payload = { ...form };
      if (!payload.dueDate) payload.dueDate = null;
      await api.put(`/api/tasks/${task._id}`, payload);
      setEdit(false);
      onChange?.();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`task ${task.status === 'completed' ? 'completed' : ''}`}>
      <button onClick={toggle} title="Toggle status">
        {task.status === 'completed' ? '☑' : '☐'}
      </button>
      <div style={{ flex: 1 }}>
        {!edit ? (
          <>
            <div className="title"><strong>{task.title}</strong></div>
            {task.description && <div style={{ color: '#cbd5e1' }}>{task.description}</div>}
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              <span className={`badge ${task.status}`}>{task.status}</span>
              {task.dueDate && <> · Due: {new Date(task.dueDate).toLocaleDateString()}</>}
            </div>
          </>
        ) : (
          <form onSubmit={save} className="row" style={{ flexDirection: 'column', gap: 8 }}>
            <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required />
            <textarea rows="2" value={form.description} onChange={e=>setForm({...form, description: e.target.value})}></textarea>
            <div className="row">
              <input type="date" className="col" value={form.dueDate || ''} onChange={e=>setForm({...form, dueDate: e.target.value})} />
              <button className="primary" disabled={busy}>{busy?'Saving...':'Save'}</button>
            </div>
            {err && <p style={{ color: '#fca5a5' }}>{err}</p>}
          </form>
        )}
      </div>
      {!edit ? (
        <>
          <button onClick={()=>setEdit(true)}>Edit</button>
          <button className="danger" onClick={del}>Delete</button>
        </>
      ) : (
        <button onClick={()=>setEdit(false)}>Cancel</button>
      )}
    </div>
  );
}

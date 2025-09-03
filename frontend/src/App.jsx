import React, { useEffect, useState } from 'react';
import AuthGate from './components/AuthGate.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import api from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  async function fetchMe() {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }

  async function fetchTasks(status) {
    setLoading(true);
    try {
      const qs = status && status !== 'all' ? `?status=${status}` : '';
      const { data } = await api.get(`/api/tasks${qs}`);
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMe(); }, []);
  useEffect(() => { if (user) fetchTasks(filter); }, [user, filter]);

  const logout = () => { localStorage.removeItem('token'); setUser(null); setTasks([]); };

  return (
    <div className="container">
      <div className="header">
        <h1>🗂️ Task Manager</h1>
        {user ? <div>Hi, <strong>{user.name}</strong> · <a className="link" onClick={logout} href="#">Logout</a></div> : null}
      </div>

      {!user ? (
        <div className="card"><AuthGate onAuth={fetchMe} /></div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <TaskForm onCreated={() => fetchTasks(filter)} />
          </div>

          <div className="row" style={{ marginBottom: 12 }}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="card">
            {loading ? <p>Loading...</p> : <TaskList tasks={tasks} onChange={() => fetchTasks(filter)} />}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import api from '../api';

export default function Login({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/api/auth/login', form);
      localStorage.setItem('token', data.token);
      onSuccess?.();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="row" style={{ marginBottom: 8 }}>
        <input className="col" placeholder="Email" type="email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      </div>
      <div className="row" style={{ marginBottom: 8 }}>
        <input className="col" placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      </div>
      {err && <p style={{ color: '#fca5a5' }}>{err}</p>}
      <button className="primary">Login</button>
    </form>
  );
}

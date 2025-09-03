import React, { useState } from 'react';
import api from '../api';

export default function Register({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/api/auth/register', form);
      localStorage.setItem('token', data.token);
      onSuccess?.();
    } catch (e) {
      setErr(e?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="row" style={{ marginBottom: 8 }}>
        <input className="col" placeholder="Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="row" style={{ marginBottom: 8 }}>
        <input className="col" placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} required />
      </div>
      <div className="row" style={{ marginBottom: 8 }}>
        <input className="col" placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} required />
      </div>
      {err && <p style={{ color: '#fca5a5' }}>{err}</p>}
      <button className="primary">Create Account</button>
    </form>
  );
}

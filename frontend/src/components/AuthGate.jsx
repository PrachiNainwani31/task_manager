import React, { useState } from 'react';
import Login from './Login.jsx';
import Register from './Register.jsx';

export default function AuthGate({ onAuth }) {
  const [mode, setMode] = useState('login');
  return (
    <div className="auth">
      <div>
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        {mode === 'login'
          ? <Login onSuccess={onAuth} />
          : <Register onSuccess={onAuth} />}
        <p style={{ marginTop: 8 }}>
          {mode === 'login' ? (
            <>No account? <a className="link" href="#" onClick={() => setMode('register')}>Register</a></>
          ) : (
            <>Already have an account? <a className="link" href="#" onClick={() => setMode('login')}>Login</a></>
          )}
        </p>
      </div>
      <div>
        <h2>About</h2>
        <p>Simple full-stack app with JWT auth and MongoDB storage.</p>
        <ul>
          <li>Register/Login</li>
          <li>Add / Edit / Delete / Toggle Tasks</li>
          <li>Status filter (pending/completed)</li>
          <li>Ready for Render/Heroku/Vercel</li>
        </ul>
      </div>
    </div>
  );
}

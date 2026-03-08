import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.role, { email: form.email, password: form.password });
      if (form.role === 'expert') {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your account to continue</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Login As</label>
            <select className="auth-select" onChange={e => setForm({ ...form, role: e.target.value })} value={form.role}>
              <option value="user">User</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input className="auth-input" type="email" placeholder="Enter your email" onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input className="auth-input" type="password" placeholder="Enter your password" onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          
          <button type="submit" className="auth-btn">Login</button>
        </form>
        
        <div className="auth-link-text">
          Don't have an account? <Link to={form.role === 'expert' ? '/expert/register' : '/register'}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function UserRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', profileImage: null });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== undefined) {
        data.append(key, form[key]);
      }
    });
    try {
      await register('user', data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create an Account</h2>
          <p>Register as a user to book experts</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input className="auth-input" type="text" placeholder="Full Name" onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input className="auth-input" type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input className="auth-input" type="password" placeholder="Password (min 6 chars)" minLength={6} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          
          <div className="form-group">
            <label>Profile Image (Optional)</label>
            <input className="auth-file-input" type="file" accept="image/*" onChange={e => setForm({ ...form, profileImage: e.target.files[0] })} />
          </div>
          
          <button type="submit" className="auth-btn">Register</button>
        </form>
        
        <div className="auth-link-text">
          Already have an account? <Link to="/login">Login here</Link><br/><br/>
          Are you an expert? <Link to="/expert/register">Register as Expert</Link>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ExpertRegister() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', category: '', experience: '', bio: '', hourlyRate: '', profileImage: null
  });
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
      await register('expert', data);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card large">
        <div className="auth-header">
          <h2>Apply as an Expert</h2>
          <p>Join our platform and start offering your services</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={submit} className="auth-form">
          <div className="auth-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input className="auth-input" type="text" placeholder="Jane Doe" onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input className="auth-input" type="email" placeholder="jane@example.com" onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input className="auth-input" type="password" placeholder="Min 6 characters" minLength={6} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input className="auth-input" type="text" placeholder="+91 234 567 8900" onChange={e => setForm({ ...form, phone: e.target.value })} required />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select className="auth-select" onChange={e => setForm({ ...form, category: e.target.value })} value={form.category} required>
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Experience (Years)</label>
              <input className="auth-input" type="number" placeholder="e.g. 5" onChange={e => setForm({ ...form, experience: e.target.value })} required />
            </div>
            
            <div className="form-group full-width">
              <label>Hourly Rate ($)</label>
              <input className="auth-input" type="number" placeholder="Your rate per hour" onChange={e => setForm({ ...form, hourlyRate: e.target.value })} required />
            </div>
            
            <div className="form-group full-width">
              <label>Professional Bio</label>
              <textarea className="auth-textarea" placeholder="Tell clients about yourself..." onChange={e => setForm({ ...form, bio: e.target.value })} required />
            </div>
            
            <div className="form-group full-width">
              <label>Profile Image (Optional)</label>
              <input className="auth-file-input" type="file" accept="image/*" onChange={e => setForm({ ...form, profileImage: e.target.files[0] })} />
            </div>
          </div>
          
          <button type="submit" className="auth-btn">Register as Expert</button>
        </form>
        
        <div className="auth-link-text">
          Already have an account? <Link to="/login">Login here</Link><br/><br/>
          Looking to hire an expert? <Link to="/register">Register as User</Link>
        </div>
      </div>
    </div>
  );
}
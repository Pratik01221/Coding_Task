import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import MyBookings from './MyBookings';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: '', phone: '', experience: '', bio: '', hourlyRate: '', category: '', profileImage: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [earnings, setEarnings] = useState({ totalEarnings: 0, completedSessions: 0 });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'expert') { navigate('/'); return; }

    const loadData = async () => {
      try {
        const [profileRes, earningsRes] = await Promise.all([
          API.get(`/experts/${user.id}`),
          API.get(`/bookings/expert/${user.id}/earnings`)
        ]);
        const d = profileRes.data;
        setProfile(d);
        setForm({
          name: d.name || '', phone: d.phone || '', experience: d.experience || '',
          bio: d.bio || '', hourlyRate: d.hourlyRate || '', category: d.category || '',
          profileImage: null
        });
        setEarnings(earningsRes.data);
      } catch (err) {
        setMsg({ type: 'error', text: 'Failed to load profile details' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, navigate]);

  const startEditing = () => {
    setIsEditing(true);
    setMsg({ type: '', text: '' });
  };

  const cancelEditing = () => {
    if (profile) {
      setForm({
        name: profile.name || '', phone: profile.phone || '', experience: profile.experience || '',
        bio: profile.bio || '', hourlyRate: profile.hourlyRate || '', category: profile.category || '',
        profileImage: null
      });
    }
    setIsEditing(false);
    setMsg({ type: '', text: '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    const data = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
        data.append(key, form[key]);
      }
    });

    try {
      const res = await API.put(`/experts/${user.id}`, data);
      setProfile(res.data.expert || { ...profile, ...form });
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const errMsg = err.response?.data?.details
        ? err.response.data.details.map(d => d.msg).join(', ')
        : err.response?.data?.error || err.message;
      setMsg({ type: 'error', text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-text">Loading profile...</p>
    </div>
  );

  const avatarUrl = profile?.profileImage || profile?.avatar
    ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${profile.profileImage || profile.avatar}`
    : null;

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <h1>Expert Profile Dashboard</h1>
        <p>Manage your public information and incoming bookings</p>
      </div>

      {msg.text && (
        <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: 20 }}>
          {msg.text}
        </div>
      )}

      {/* ===== Stats Cards ===== */}
      <div className="profile-stats-row">
        <div className="profile-stat-card stat-earnings">
          <div className="stat-icon-wrap stat-icon-green">💰</div>
          <div>
            <div className="stat-value">${earnings.totalEarnings.toLocaleString()}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>
        <div className="profile-stat-card stat-sessions">
          <div className="stat-icon-wrap stat-icon-blue">✅</div>
          <div>
            <div className="stat-value">{earnings.completedSessions}</div>
            <div className="stat-label">Completed Sessions</div>
          </div>
        </div>
        <div className="profile-stat-card stat-rate">
          <div className="stat-icon-wrap stat-icon-purple">⏱️</div>
          <div>
            <div className="stat-value">${profile?.hourlyRate || 0}/hr</div>
            <div className="stat-label">Hourly Rate</div>
          </div>
        </div>
      </div>

      {/* ===== Profile Card ===== */}
      <div className="card profile-card-main">
        <div className="profile-card-header">
          <h2>Public Profile</h2>
          {!isEditing ? (
            <button className="btn btn-outline profile-edit-btn" onClick={startEditing}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-outline" onClick={cancelEditing} style={{ color: 'var(--gray-500)', borderColor: 'var(--gray-300)' }}>
                Cancel
              </button>
              <button className="btn btn-sm btn-primary" onClick={submit} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          /* ===== READ-ONLY DISPLAY ===== */
          <div className="profile-display">
            <div className="profile-display-header">
              <div className="profile-avatar-wrapper">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={profile?.name} className="profile-avatar-lg" />
                ) : (
                  <div className="profile-avatar-lg profile-avatar-placeholder">
                    {(profile?.name || 'E').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="profile-display-identity">
                <h3 className="profile-display-name">{profile?.name}</h3>
                <span className="expert-category-badge">{profile?.category}</span>
              </div>
            </div>

            <div className="profile-display-grid">
              <div className="profile-display-field">
                <span className="profile-field-label">📞 Phone</span>
                <span className="profile-field-value">{profile?.phone || '—'}</span>
              </div>
              <div className="profile-display-field">
                <span className="profile-field-label">📧 Email</span>
                <span className="profile-field-value">{profile?.email || '—'}</span>
              </div>
              <div className="profile-display-field">
                <span className="profile-field-label">🧑‍💼 Experience</span>
                <span className="profile-field-value">{profile?.experience || 0} years</span>
              </div>
              <div className="profile-display-field">
                <span className="profile-field-label">💲 Hourly Rate</span>
                <span className="profile-field-value">${profile?.hourlyRate || 0}/hr</span>
              </div>
              <div className="profile-display-field profile-display-field-full">
                <span className="profile-field-label">📝 Bio</span>
                <span className="profile-field-value">{profile?.bio || 'No bio provided.'}</span>
              </div>
            </div>
          </div>
        ) : (
          /* ===== EDIT MODE ===== */
          <form onSubmit={submit} className="profile-edit-form">
            <div className="auth-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input className="auth-input" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="auth-input" type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
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
                <input className="auth-input" type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} required />
              </div>
              <div className="form-group full-width">
                <label>Hourly Rate ($)</label>
                <input className="auth-input" type="number" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} required />
              </div>
              <div className="form-group full-width">
                <label>Professional Bio</label>
                <textarea className="auth-textarea" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} required />
              </div>
              <div className="form-group full-width">
                <label>Upload New Profile Image (Optional)</label>
                <input className="auth-file-input" type="file" accept="image/*" onChange={e => setForm({ ...form, profileImage: e.target.files[0] })} />
              </div>
            </div>
            <button type="submit" className="auth-btn" disabled={saving} style={{ marginTop: 16 }}>
              {saving ? 'Saving Changes...' : '💾 Save Profile Details'}
            </button>
          </form>
        )}
      </div>

      <hr style={{ borderTop: '0px', borderBottom: '1px solid var(--gray-200)', margin: '40px 0' }} />

      <h2 style={{ fontSize: '1.6rem', marginBottom: '24px', fontWeight: 800 }}>Incoming Client Sessions</h2>
      <MyBookings isEmbedded={true} />
    </div>
  );
}

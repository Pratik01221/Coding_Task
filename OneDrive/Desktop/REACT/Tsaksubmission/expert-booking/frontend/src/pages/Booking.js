import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';

const INITIAL = {
  userName: '',
  email: '',
  phone: '',
  date: '',
  timeSlot: '',
  notes: '',
};

function validate(fields) {
  const errors = {};
  if (!fields.userName.trim()) errors.userName = 'Full name is required';
  else if (fields.userName.trim().length < 2) errors.userName = 'Name must be at least 2 characters';

  if (!fields.email) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(fields.email)) errors.email = 'Enter a valid email address';

  if (!fields.phone) errors.phone = 'Phone number is required';
  else if (!/^\+?[\d\s\-().]{7,17}$/.test(fields.phone)) errors.phone = 'Enter a valid phone number (e.g. +91 98765 43210)';

  const today = new Date().toISOString().split('T')[0];
  if (!fields.date) errors.date = 'Date is required';
  else if (fields.date < today) errors.date = 'Date must be today or in the future';

  if (!fields.timeSlot) errors.timeSlot = 'Please select a time slot';
  else if (!/^\d{2}:\d{2}$/.test(fields.timeSlot)) errors.timeSlot = 'Time slot must be in HH:MM format (e.g. 09:30 or 14:00)';

  if (fields.notes && fields.notes.length > 500) errors.notes = 'Notes must be under 500 characters';

  return errors;
}

export default function Booking() {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expertName = searchParams.get('name') || 'Expert';
  const preDate = searchParams.get('date') || '';
  const preTime = searchParams.get('time') || '';

  const [form, setForm] = useState({ ...INITIAL, date: preDate, timeSlot: preTime });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const { data } = await API.post('/bookings', { expertId, ...form });
      setBooking(data.booking);
      setSuccess(true);
    } catch (err) {
      if (err.response?.data?.details) {
        setSubmitError(err.response.data.details.map(d => d.msg).join(', '));
      } else {
        setSubmitError(err.response?.data?.error || err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getToday = () => new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="card success-card">
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p>
          Your session with <strong>{expertName}</strong> on <strong>{booking?.date}</strong> at{' '}
          <strong>{booking?.timeSlot}</strong> has been requested. You'll receive confirmation shortly.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/my-bookings" className="btn btn-primary">
            View My Bookings
          </Link>
          <Link to="/" className="btn btn-outline">
            Browse More Experts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="booking-page">
        <div className="card booking-form-card">
          <h1>Book a Session</h1>
          <p className="subtitle">Schedule your 1-on-1 session with <strong>{expertName}</strong></p>

          {submitError && (
            <div className="alert alert-error" style={{ marginBottom: 24 }}>
              ⚠️ {submitError}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input
                className={`form-input ${errors.userName ? 'error' : ''}`}
                name="userName"
                value={form.userName}
                onChange={handleChange}
                placeholder="John Doe"
              />
              {errors.userName && <span className="form-error">{errors.userName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone <span className="required">*</span></label>
              <input
                className={`form-input ${errors.phone ? 'error' : ''}`}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date <span className="required">*</span></label>
              <input
                className={`form-input ${errors.date ? 'error' : ''}`}
                name="date"
                type="date"
                min={getToday()}
                value={form.date}
                onChange={(e) => {
                  // HTML date input always gives YYYY-MM-DD regardless of locale display
                  handleChange(e);
                }}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Time Slot <span className="required">*</span></label>
              <div style={{ marginTop: 6 }}>
                <input
                  type="time"
                  className={`form-input ${errors.timeSlot ? 'error' : ''}`}
                  name="timeSlot"
                  value={form.timeSlot}
                  onChange={handleChange}
                  required
                  style={{ maxWidth: '200px' }}
                />
                {!form.timeSlot && (
                  <span style={{ marginLeft: 12, fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                    Choose a time for your session
                  </span>
                )}
              </div>
              {errors.timeSlot && <span className="form-error" style={{ display: 'block', marginTop: 4 }}>{errors.timeSlot}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Session Notes</label>
              <textarea
                className={`form-textarea ${errors.notes ? 'error' : ''}`}
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Tell the expert what you'd like to discuss or get help with..."
                rows={4}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {errors.notes ? (
                  <span className="form-error">{errors.notes}</span>
                ) : <span />}
                <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                  {form.notes.length}/500
                </span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ marginTop: 28, width: '100%' }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '⏳ Booking...' : '🎯 Confirm Booking'}
          </button>
        </div>

        <div className="card summary-card">
          <h3>Booking Summary</h3>
          <div className="summary-item">
            <span className="label">Expert</span>
            <span className="value">{expertName}</span>
          </div>
          <div className="summary-item">
            <span className="label">Date</span>
            <span className="value">{form.date || '—'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Time</span>
            <span className="value">{form.timeSlot || '—'}</span>
          </div>
          <div className="summary-item">
            <span className="label">Duration</span>
            <span className="value">60 minutes</span>
          </div>
          <div className="summary-item summary-total">
            <span className="label">Status</span>
            <span className="value" style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>
              Pending Confirmation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'status-pending', icon: '⏳' },
  confirmed: { label: 'Confirmed', className: 'status-confirmed', icon: '✅' },
  completed: { label: 'Completed', className: 'status-completed', icon: '🎉' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled', icon: '❌' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function MyBookings() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const endpoint = user.role === 'expert' 
          ? `/bookings/expert/${user.id}` 
          : `/bookings/user/${user.id}`;
        
        const { data } = await API.get(endpoint);
        setBookings(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await API.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };
  
  const handleReschedule = async (bookingId, expertId) => {
    if (window.confirm('This will cancel the current booking so you can schedule a new time. Proceed?')) {
      await handleStatusUpdate(bookingId, 'cancelled');
      if (user.role === 'user') {
        navigate(`/book/${expertId}`);
      }
    }
  };

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔒</div>
        <h3>Authentication Required</h3>
        <p>You must be logged in to view your bookings.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: 16 }}>
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>{user.role === 'expert' ? 'My Appointments' : 'My Bookings'}</h1>
        <p>{user.role === 'expert' ? 'Manage your incoming client sessions' : 'Track and manage your expert sessions'}</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Loading your schedule...</p>
        </div>
      )}

      {!loading && bookings.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No bookings found</h3>
          <p>You don't have any scheduled sessions yet.</p>
          {user.role === 'user' && (
            <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
              Browse Experts
            </Link>
          )}
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="bookings-list">
          {bookings.map((b) => {
            const statusConf = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
            const isExpert = user.role === 'expert';
            
            return (
              <div key={b._id} className="card booking-item">
                <div>
                  <div className="booking-expert-name">
                    {isExpert ? `Client: ${b.userName}` : `Expert: ${b.expertName || b.expertId?.name}`}
                  </div>
                  {!isExpert && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: 6 }}>
                      {b.expertId?.category || ''}
                    </div>
                  )}
                  <div className="booking-details">
                    <span className="booking-detail">📅 {formatDate(b.date)}</span>
                    <span className="booking-detail">🕐 {b.timeSlot}</span>
                    {isExpert ? (
                      <span className="booking-detail">✉️ {b.email}</span>
                    ) : (
                      <span className="booking-detail">👤 Booked by you</span>
                    )}
                  </div>
                  {b.notes && (
                    <p style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--gray-500)', fontStyle: 'italic' }}>
                      "{(b.notes || "").substring(0, 80)}{(b.notes || "").length > 80 ? '...' : ''}"
                    </p>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <span className={`status-badge ${statusConf.className}`}>
                    {statusConf.icon} {statusConf.label}
                  </span>
                  
                  {['pending', 'confirmed'].includes(b.status) && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: 10 }}>
                      
                      {isExpert && b.status === 'pending' && (
                        <button
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.75rem', color: 'var(--success)', borderColor: 'var(--success)', padding: '6px 10px' }}
                          onClick={() => handleStatusUpdate(b._id, 'confirmed')}
                        >
                          Confirm Session
                        </button>
                      )}
                      
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.75rem', color: 'var(--warning)', borderColor: 'var(--warning)', padding: '6px 10px' }}
                        onClick={() => handleReschedule(b._id, isExpert ? b.expertId : (b.expertId?._id || b.expertId))}
                      >
                        Reschedule
                      </button>
                      
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.75rem', color: 'var(--error)', borderColor: 'var(--error)', padding: '6px 10px' }}
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this booking?')) {
                            handleStatusUpdate(b._id, 'cancelled');
                          }
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  
                  {isExpert && b.status === 'confirmed' && (
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                      onClick={() => handleStatusUpdate(b._id, 'completed')}
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { formatTime } from '../utils/prayerTimes';
import RequestModal from './RequestModal';
import ConfirmDialog from './ConfirmDialog';
import { requestAPI } from '../services/api';
import './MasjidDetails.css';

const MasjidDetails = ({ masjid, onClose, userLocation }) => {
  const { user } = useContext(AuthContext);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [message, setMessage] = useState('');

  const getDirections = () => {
    const [lng, lat] = masjid.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const calculateDistance = () => {
    if (!userLocation) return null;
    
    const [lng, lat] = masjid.location.coordinates;
    const R = 6371;
    const dLat = (lat - userLocation[0]) * Math.PI / 180;
    const dLon = (lng - userLocation[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation[0] * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(2);
  };

  const handleRequestEdit = () => {
    if (!user) {
      alert('Please login to request edits');
      return;
    }
    setRequestType('edit_masjid');
    setShowRequestModal(true);
  };

  const handleRequestDelete = () => {
    if (!user) {
      alert('Please login to request deletion');
      return;
    }
    setConfirmAction(() => () => {
      setRequestType('delete_masjid');
      setShowRequestModal(true);
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleSubmitRequest = async (formData) => {
    try {
      const requestData = {
        type: requestType,
        masjidId: masjid._id,
        reason: formData.reason
      };

      if (requestType === 'edit_masjid') {
        requestData.masjidData = {
          name: formData.name,
          address: formData.address,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          description: formData.description,
          phoneNumber: formData.phoneNumber,
          prayerTimes: formData.prayerTimes
        };
      }

      await requestAPI.create(requestData);
      setMessage('Request submitted successfully! Waiting for admin approval.');
      setShowRequestModal(false);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit request');
    }
  };

  const distance = calculateDistance();

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{masjid.name}</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          
          <div className="modal-body">
            {message && <div className="alert alert-success">{message}</div>}

            <div className="detail-section">
              <p><strong>Address:</strong> {masjid.address}</p>
              {distance && <p><strong>Distance:</strong> {distance} km</p>}
              {masjid.phoneNumber && <p><strong>Phone:</strong> {masjid.phoneNumber}</p>}
              {masjid.description && <p><strong>Description:</strong> {masjid.description}</p>}
            </div>

            <div className="prayer-times-section">
              <h3>Prayer Times</h3>
              <div className="prayer-times-grid">
                <div className="prayer-time-item">
                  <span className="prayer-name">Fajr</span>
                  <span className="prayer-time">{formatTime(masjid.prayerTimes.fajr)}</span>
                </div>
                <div className="prayer-time-item">
                  <span className="prayer-name">Dhuhr</span>
                  <span className="prayer-time">{formatTime(masjid.prayerTimes.dhuhr)}</span>
                </div>
                <div className="prayer-time-item">
                  <span className="prayer-name">Asr</span>
                  <span className="prayer-time">{formatTime(masjid.prayerTimes.asr)}</span>
                </div>
                <div className="prayer-time-item">
                  <span className="prayer-name">Maghrib</span>
                  <span className="prayer-time">{formatTime(masjid.prayerTimes.maghrib)}</span>
                </div>
                <div className="prayer-time-item">
                  <span className="prayer-name">Isha</span>
                  <span className="prayer-time">{formatTime(masjid.prayerTimes.isha)}</span>
                </div>
                {masjid.prayerTimes.jummah && (
                  <div className="prayer-time-item">
                    <span className="prayer-name">Jummah</span>
                    <span className="prayer-time">{formatTime(masjid.prayerTimes.jummah)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="action-buttons">
              <button className="directions-btn" onClick={getDirections}>
                🗺️ Get Directions
              </button>

              {user && user.role === 'user' && (
                <>
                  <button className="btn btn-warning" onClick={handleRequestEdit}>
                    ✏️ Request Edit
                  </button>
                  <button className="btn btn-danger" onClick={handleRequestDelete}>
                    🗑️ Request Delete
                  </button>
                </>
              )}

              {!user && (
                <p className="login-prompt">
                  <a href="/login">Login</a> to request edits or report issues
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRequestModal && (
        <RequestModal
          type={requestType}
          masjid={masjid}
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleSubmitRequest}
        />
      )}

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to request deletion of this masjid? This will be reviewed by an admin."
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default MasjidDetails;
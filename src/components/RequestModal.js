import React, { useState } from 'react';
import './RequestModal.css';

const RequestModal = ({ type, masjid, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: masjid?.name || '',
    address: masjid?.address || '',
    latitude: masjid?.location?.coordinates[1]?.toString() || '',
    longitude: masjid?.location?.coordinates[0]?.toString() || '',
    description: masjid?.description || '',
    phoneNumber: masjid?.phoneNumber || '',
    prayerTimes: masjid?.prayerTimes || {
      fajr: '',
      dhuhr: '',
      asr: '',
      maghrib: '',
      isha: '',
      jummah: ''
    },
    reason: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getTitle = () => {
    switch (type) {
      case 'admin_access':
        return 'Request Admin Access';
      case 'add_masjid':
        return 'Request to Add Masjid';
      case 'edit_masjid':
        return 'Request to Edit Masjid';
      case 'delete_masjid':
        return 'Request to Delete Masjid';
      default:
        return 'Submit Request';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content request-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getTitle()}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {type === 'admin_access' && (
            <div className="form-group">
              <label>Why do you want admin access?</label>
              <textarea
                name="reason"
                className="form-control"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Please explain why you need admin access..."
              />
            </div>
          )}

          {type === 'delete_masjid' && (
            <div className="form-group">
              <label>Reason for deletion</label>
              <textarea
                name="reason"
                className="form-control"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Please explain why this masjid should be deleted..."
              />
            </div>
          )}

          {(type === 'add_masjid' || type === 'edit_masjid') && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Masjid Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    className="form-control"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    className="form-control"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <h3>Prayer Times</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Fajr *</label>
                  <input
                    type="time"
                    name="prayerTimes.fajr"
                    className="form-control"
                    value={formData.prayerTimes.fajr}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Dhuhr *</label>
                  <input
                    type="time"
                    name="prayerTimes.dhuhr"
                    className="form-control"
                    value={formData.prayerTimes.dhuhr}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Asr *</label>
                  <input
                    type="time"
                    name="prayerTimes.asr"
                    className="form-control"
                    value={formData.prayerTimes.asr}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Maghrib *</label>
                  <input
                    type="time"
                    name="prayerTimes.maghrib"
                    className="form-control"
                    value={formData.prayerTimes.maghrib}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Isha *</label>
                  <input
                    type="time"
                    name="prayerTimes.isha"
                    className="form-control"
                    value={formData.prayerTimes.isha}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Jummah</label>
                  <input
                    type="time"
                    name="prayerTimes.jummah"
                    className="form-control"
                    value={formData.prayerTimes.jummah}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes/Reason</label>
                <textarea
                  name="reason"
                  className="form-control"
                  rows="3"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Any additional information..."
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Submit Request
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
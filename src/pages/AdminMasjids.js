import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { masjidAPI, requestAPI } from '../services/api';
import Map from '../components/Map';
import ConfirmDialog from '../components/ConfirmDialog';
import './AdminMasjids.css';

const AdminMasjids = () => {
  const { user } = useContext(AuthContext);
  const [masjids, setMasjids] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMasjid, setEditingMasjid] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    description: '',
    phoneNumber: '',
    prayerTimes: {
      fajr: '',
      dhuhr: '',
      asr: '',
      maghrib: '',
      isha: '',
      jummah: ''
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  useEffect(() => {
    fetchMasjids();
  }, []);

  const fetchMasjids = async () => {
    try {
      const response = await masjidAPI.getAll();
      setMasjids(response.data.data);
    } catch (err) {
      setError('Failed to fetch masjids');
    }
  };

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

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      description: '',
      phoneNumber: '',
      prayerTimes: {
        fajr: '',
        dhuhr: '',
        asr: '',
        maghrib: '',
        isha: '',
        jummah: ''
      }
    });
    setEditingMasjid(null);
    setShowForm(false);
    setTempLocation(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const action = async () => {
      setError('');
      setSuccess('');
      setLoading(true);

      try {
        if (user.role === 'main_admin') {
          // Main admin can directly add/edit
          if (editingMasjid) {
            await masjidAPI.update(editingMasjid._id, formData);
            setSuccess('Masjid updated successfully');
          } else {
            await masjidAPI.create(formData);
            setSuccess('Masjid created successfully');
          }
          fetchMasjids();
          resetForm();
        } else {
          // Regular admin must submit request
          const requestData = {
            type: editingMasjid ? 'edit_masjid' : 'add_masjid',
            masjidData: {
              name: formData.name,
              address: formData.address,
              latitude: parseFloat(formData.latitude),
              longitude: parseFloat(formData.longitude),
              description: formData.description,
              phoneNumber: formData.phoneNumber,
              prayerTimes: formData.prayerTimes
            }
          };

          if (editingMasjid) {
            requestData.masjidId = editingMasjid._id;
          }

          await requestAPI.create(requestData);
          setSuccess('Request submitted successfully! Waiting for main admin approval.');
          resetForm();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Operation failed');
      } finally {
        setLoading(false);
        setShowConfirm(false);
      }
    };

    // Show confirmation dialog
    setConfirmMessage(
      editingMasjid 
        ? `Are you sure you want to ${user.role === 'main_admin' ? 'update' : 'request to update'} this masjid?`
        : `Are you sure you want to ${user.role === 'main_admin' ? 'add' : 'request to add'} this masjid?`
    );
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  const handleEdit = (masjid) => {
    if (user.role !== 'main_admin') {
      // Regular admin can only request edit
      alert('As a regular admin, you can request edits. This will be submitted for approval.');
    }
    
    setEditingMasjid(masjid);
    setFormData({
      name: masjid.name,
      address: masjid.address,
      latitude: masjid.location.coordinates[1].toString(),
      longitude: masjid.location.coordinates[0].toString(),
      description: masjid.description || '',
      phoneNumber: masjid.phoneNumber || '',
      prayerTimes: masjid.prayerTimes
    });
    setTempLocation({
      lat: masjid.location.coordinates[1],
      lng: masjid.location.coordinates[0]
    });
    setShowForm(true);
  };

  const handleDelete = (masjid) => {
    if (user.role !== 'main_admin') {
      alert('Only main admin can delete masjids');
      return;
    }

    const action = async () => {
      try {
        await masjidAPI.delete(masjid._id);
        setSuccess('Masjid deleted successfully');
        fetchMasjids();
      } catch (err) {
        setError('Failed to delete masjid');
      } finally {
        setShowConfirm(false);
      }
    };

    setConfirmMessage(`Are you sure you want to delete "${masjid.name}"? This action cannot be undone.`);
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData({
            ...formData,
            latitude: lat.toString(),
            longitude: lng.toString()
          });
          setTempLocation({ lat, lng });
        },
        (error) => {
          alert('Unable to get your location');
        }
      );
    }
  };

  const handleMapClick = (latlng) => {
    setTempLocation(latlng);
    setFormData({
      ...formData,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6)
    });
  };

  if (!user || (user.role !== 'admin' && user.role !== 'main_admin')) {
    return <div className="container">You don't have permission to access this page.</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Manage Masjids</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : `+ ${user.role === 'main_admin' ? 'Add' : 'Request to Add'} New Masjid`}
        </button>
      </div>

      {user.role === 'admin' && (
        <div className="alert" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          ⚠️ As a regular admin, your changes will be submitted as requests for main admin approval.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card">
          <h2>{editingMasjid ? `${user.role === 'main_admin' ? 'Edit' : 'Request to Edit'} Masjid` : `${user.role === 'main_admin' ? 'Add' : 'Request to Add'} New Masjid`}</h2>
          <form onSubmit={handleSubmit}>
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

              <div className="form-group">
                <label>&nbsp;</label>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={getCurrentLocation}
                >
                  📍 Use My Location
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Or click on the map below to select location</label>
              <div className="map-picker">
                <Map
                  masjids={[]}
                  userLocation={null}
                  onMasjidClick={null}
                  onMapClick={handleMapClick}
                  selectedLocation={tempLocation}
                />
              </div>
              {tempLocation && (
                <p className="location-selected">
                  ✓ Location selected: Lat {tempLocation.lat.toFixed(6)}, Lng {tempLocation.lng.toFixed(6)}
                </p>
              )}
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

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : editingMasjid ? (user.role === 'main_admin' ? 'Update Masjid' : 'Submit Edit Request') : (user.role === 'main_admin' ? 'Add Masjid' : 'Submit Add Request')}
              </button>
              <button type="button" className="btn btn-danger" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="masjids-table">
        <h2>All Masjids ({masjids.length})</h2>
        {masjids.length === 0 ? (
          <p>No masjids added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {masjids.map((masjid) => (
                <tr key={masjid._id}>
                  <td>{masjid.name}</td>
                  <td>{masjid.address}</td>
                  <td>{masjid.phoneNumber || 'N/A'}</td>
                  <td className="actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(masjid)}
                    >
                      {user.role === 'main_admin' ? 'Edit' : 'Request Edit'}
                    </button>
                    {user.role === 'main_admin' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(masjid)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showConfirm && (
        <ConfirmDialog
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default AdminMasjids;
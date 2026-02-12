import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Map from '../components/Map';
import MasjidDetails from '../components/MasjidDetails';
import RequestModal from '../components/RequestModal';
import { masjidAPI, requestAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [masjids, setMasjids] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMasjid, setSelectedMasjid] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAdminRequestBtn, setShowAdminRequestBtn] = useState(false);
  const [message, setMessage] = useState('');

  const fetchNearbyMasjids = useCallback(async () => {
    if (!userLocation) return;
    
    try {
      setLoading(true);
      const response = await masjidAPI.getNearby(userLocation[1], userLocation[0], 10000);
      setMasjids(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch nearby masjids');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  const fetchAllMasjids = useCallback(async () => {
    try {
      setLoading(true);
      const response = await masjidAPI.getAll();
      setMasjids(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch masjids');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyMasjids();
    } else {
      fetchAllMasjids();
    }
  }, [userLocation, fetchNearbyMasjids, fetchAllMasjids]);

  useEffect(() => {
    // Show admin request button only for regular users
    if (user && user.role === 'user') {
      setShowAdminRequestBtn(true);
    } else {
      setShowAdminRequestBtn(false);
    }
  }, [user]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation(null);
        }
      );
    }
  };

  const handleMapClick = (latlng) => {
    setSelectedLocation(latlng);
  };

  const handleRequestMasjid = () => {
    if (!user) {
      alert('Please login to request adding a masjid');
      window.location.href = '/login';
      return;
    }
    setShowRequestModal(true);
  };

  const handleRequestAdmin = async () => {
    if (!user) {
      alert('Please login to request admin access');
      window.location.href = '/login';
      return;
    }

    try {
      await requestAPI.create({
        type: 'admin_access',
        reason: 'Requesting admin access'
      });
      setMessage('Admin access request submitted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleSubmitMasjidRequest = async (formData) => {
    try {
      await requestAPI.create({
        type: 'add_masjid',
        masjidData: {
          name: formData.name,
          address: formData.address,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          description: formData.description,
          phoneNumber: formData.phoneNumber,
          prayerTimes: formData.prayerTimes
        },
        reason: formData.reason
      });
      
      setMessage('Masjid addition request submitted successfully!');
      setShowRequestModal(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Find Masjids Near You</h1>
        <p>Locate nearby masjids and view prayer times</p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          💡 Tip: Click anywhere on the map to get coordinates for adding a new masjid
        </p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {selectedLocation && (
        <div className="location-info">
          <strong>Selected Location:</strong> 
          <span style={{ marginLeft: '10px' }}>
            Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`);
              alert('Coordinates copied to clipboard!');
            }}
            style={{
              marginLeft: '15px',
              padding: '5px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📋 Copy
          </button>
          <button
            onClick={() => setSelectedLocation(null)}
            style={{
              marginLeft: '10px',
              padding: '5px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ✕ Clear
          </button>
        </div>
      )}

      <div className="action-bar">
        <button className="btn btn-primary" onClick={handleRequestMasjid}>
          ➕ Request to Add Masjid
        </button>
        
        {showAdminRequestBtn && (
          <button className="btn btn-warning" onClick={handleRequestAdmin}>
            👑 Request Admin Access
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading masjids...</div>
      ) : (
        <>
          <div className="map-container">
            <Map
              masjids={masjids}
              userLocation={userLocation}
              onMasjidClick={setSelectedMasjid}
              onMapClick={handleMapClick}
              selectedLocation={selectedLocation}
            />
          </div>

          <div className="masjids-list">
            <h2>Nearby Masjids ({masjids.length})</h2>
            {masjids.length === 0 ? (
              <p>No masjids found nearby. Try adjusting your location.</p>
            ) : (
              <div className="masjid-cards">
                {masjids.map((masjid) => (
                  <div
                    key={masjid._id}
                    className="masjid-card"
                    onClick={() => setSelectedMasjid(masjid)}
                  >
                    <h3>{masjid.name}</h3>
                    <p>{masjid.address}</p>
                    <button className="btn btn-primary">View Details</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedMasjid && (
        <MasjidDetails
          masjid={selectedMasjid}
          onClose={() => setSelectedMasjid(null)}
          userLocation={userLocation}
        />
      )}

      {showRequestModal && (
        <RequestModal
          type="add_masjid"
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleSubmitMasjidRequest}
        />
      )}
    </div>
  );
};

export default Home;
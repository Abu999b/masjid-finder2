import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { requestAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import './AdminRequests.css';

const AdminRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = filter ? { status: filter } : {};
      const response = await requestAPI.getAll(params);
      setRequests(response.data.data);
    } catch (err) {
      console.error('Fetch requests error:', err);
      setError(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleProcessRequest = (requestId, status) => {
    setConfirmData({ requestId, status });
    setShowConfirm(true);
  };

  const confirmProcess = async () => {
    try {
      setError('');
      const { requestId, status } = confirmData;
      await requestAPI.process(requestId, { status, adminResponse });
      setSuccess(`Request ${status} successfully`);
      setSelectedRequest(null);
      setAdminResponse('');
      setShowConfirm(false);
      fetchRequests();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Process request error:', err);
      setError(err.response?.data?.message || 'Failed to process request');
      setShowConfirm(false);
    }
  };

  const getRequestTypeLabel = (type) => {
    const labels = {
      admin_access: 'Admin Access',
      add_masjid: 'Add Masjid',
      edit_masjid: 'Edit Masjid',
      delete_masjid: 'Delete Masjid'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger'
    };
    return badges[status] || '';
  };

  if (!user || user.role !== 'main_admin') {
    return (
      <div className="container">
        <div className="alert alert-error">
          Only the main admin can access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Manage Requests</h1>
        <div className="filter-buttons">
          <button
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
          <button
            className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('')}
          >
            All
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : (
        <div className="requests-list">
          {requests.length === 0 ? (
            <p>No {filter} requests found.</p>
          ) : (
            requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div>
                    <span className={`badge ${getStatusBadge(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                    <span className="request-type">
                      {getRequestTypeLabel(request.type)}
                    </span>
                  </div>
                  <div className="request-date">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="request-body">
                  <p>
                    <strong>Requested by:</strong> {request.requestedBy.name} ({request.requestedBy.email})
                    {request.requestedBy.role && <span className="user-role"> - {request.requestedBy.role}</span>}
                  </p>

                  {request.type === 'admin_access' && (
                    <p><strong>Reason:</strong> {request.reason || 'No reason provided'}</p>
                  )}

                  {(request.type === 'edit_masjid' || request.type === 'delete_masjid') && request.masjidId && (
                    <p>
                      <strong>Masjid:</strong> {request.masjidId.name} - {request.masjidId.address}
                    </p>
                  )}

                  {(request.type === 'add_masjid' || request.type === 'edit_masjid') && request.masjidData && (
                    <div className="masjid-data">
                      <h4>Masjid Details:</h4>
                      <p><strong>Name:</strong> {request.masjidData.name}</p>
                      <p><strong>Address:</strong> {request.masjidData.address}</p>
                      <p><strong>Location:</strong> {request.masjidData.latitude}, {request.masjidData.longitude}</p>
                      {request.masjidData.phoneNumber && (
                        <p><strong>Phone:</strong> {request.masjidData.phoneNumber}</p>
                      )}
                      {request.masjidData.description && (
                        <p><strong>Description:</strong> {request.masjidData.description}</p>
                      )}
                      <div className="prayer-times-compact">
                        <strong>Prayer Times:</strong>
                        <span>Fajr: {request.masjidData.prayerTimes.fajr}</span>
                        <span>Dhuhr: {request.masjidData.prayerTimes.dhuhr}</span>
                        <span>Asr: {request.masjidData.prayerTimes.asr}</span>
                        <span>Maghrib: {request.masjidData.prayerTimes.maghrib}</span>
                        <span>Isha: {request.masjidData.prayerTimes.isha}</span>
                        {request.masjidData.prayerTimes.jummah && (
                          <span>Jummah: {request.masjidData.prayerTimes.jummah}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {request.reason && request.type !== 'admin_access' && (
                    <p><strong>Reason:</strong> {request.reason}</p>
                  )}

                  {request.adminResponse && (
                    <div className="admin-response">
                      <strong>Admin Response:</strong> {request.adminResponse}
                      <br />
                      <small>Processed by: {request.processedBy?.name}</small>
                    </div>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="request-actions">
                    <textarea
                      className="form-control"
                      placeholder="Admin response (optional)"
                      value={selectedRequest === request._id ? adminResponse : ''}
                      onChange={(e) => {
                        setSelectedRequest(request._id);
                        setAdminResponse(e.target.value);
                      }}
                      rows="2"
                    />
                    <div className="action-buttons">
                      <button
                        className="btn btn-success"
                        onClick={() => handleProcessRequest(request._id, 'approved')}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleProcessRequest(request._id, 'rejected')}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          message={`Are you sure you want to ${confirmData.status} this request?`}
          onConfirm={confirmProcess}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default AdminRequests;
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { requestAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import './MyRequests.css';

const MyRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  const fetchMyRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await requestAPI.getMyRequests();
      setRequests(response.data.data);
    } catch (err) {
      console.error('Fetch my requests error:', err);
      setError(err.response?.data?.message || 'Failed to fetch your requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyRequests();
    }
  }, [user, fetchMyRequests]);

  const handleDelete = (requestId) => {
    setDeleteRequestId(requestId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setError('');
      await requestAPI.delete(deleteRequestId);
      setSuccess('Request deleted successfully');
      fetchMyRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete request error:', err);
      setError(err.response?.data?.message || 'Failed to delete request');
    } finally {
      setShowConfirm(false);
      setDeleteRequestId(null);
    }
  };

  const getRequestTypeLabel = (type) => {
    const labels = {
      admin_access: 'Admin Access Request',
      add_masjid: 'Add Masjid Request',
      edit_masjid: 'Edit Masjid Request',
      delete_masjid: 'Delete Masjid Request'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: '⏳ Pending' },
      approved: { class: 'badge-success', text: '✓ Approved' },
      rejected: { class: 'badge-danger', text: '✗ Rejected' }
    };
    return badges[status] || { class: '', text: status };
  };

  if (!user) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Please login to view your requests.
        </div>
      </div>
    );
  }

  return (
    <div className="my-requests-container">
      <div className="page-header">
        <h1>My Requests</h1>
        <p>Track the status of your submitted requests</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading">Loading your requests...</div>
      ) : (
        <div className="requests-grid">
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>You haven't submitted any requests yet.</p>
              <a href="/" className="btn btn-primary">Go to Home</a>
            </div>
          ) : (
            requests.map((request) => {
              const statusBadge = getStatusBadge(request.status);
              return (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <h3>{getRequestTypeLabel(request.type)}</h3>
                    <span className={`badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <div className="request-details">
                    <p className="request-date">
                      <strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}
                    </p>

                    {request.type === 'admin_access' && (
                      <p><strong>Reason:</strong> {request.reason || 'No reason provided'}</p>
                    )}

                    {(request.type === 'add_masjid' || request.type === 'edit_masjid') && request.masjidData && (
                      <div className="masjid-info">
                        <p><strong>Masjid:</strong> {request.masjidData.name}</p>
                        <p><strong>Address:</strong> {request.masjidData.address}</p>
                      </div>
                    )}

                    {(request.type === 'edit_masjid' || request.type === 'delete_masjid') && request.masjidId && (
                      <div className="masjid-info">
                        <p><strong>Masjid:</strong> {request.masjidId.name}</p>
                        <p><strong>Address:</strong> {request.masjidId.address}</p>
                      </div>
                    )}

                    {request.adminResponse && (
                      <div className="admin-response">
                        <strong>Admin Response:</strong>
                        <p>{request.adminResponse}</p>
                        {request.processedBy && (
                          <small>Reviewed by: {request.processedBy.name}</small>
                        )}
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(request._id)}
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to cancel this request?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default MyRequests;
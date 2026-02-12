import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">⚠️</div>
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
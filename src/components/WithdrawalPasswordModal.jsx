import React, { useState } from 'react';
import './WithdrawalPasswordModal.css';

const WithdrawalPasswordModal = ({ onSubmit, onClose }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (password.trim()) {
      onSubmit(password);
      setPassword('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <strong>Withdrawal Password</strong>
          <span className="close-icon" onClick={onClose}>×</span>
        </div>
        <input
          type="password"
          placeholder="Withdrawal Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="modal-input"
        />
        <button className="modal-submit" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default WithdrawalPasswordModal;
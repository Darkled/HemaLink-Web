import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cancelAppointment } from './cancel.services.js';

const CancelAppointment = () => {
  const { bloodRequestId, cancellationToken } = useParams();
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function performCancellation() {
      try {
        await cancelAppointment(bloodRequestId, cancellationToken);
        setStatus('success');
      } catch (err) {
        console.error('Cancellation error:', err);
        setStatus('error');
        setErrorMessage(err.message || 'An unexpected error occurred while trying to cancel the appointment.');
      }
    }

    if (bloodRequestId && cancellationToken) {
      performCancellation();
    } else {
      setStatus('error');
      setErrorMessage('Incomplete cancellation information in the URL.');
    }
  }, [bloodRequestId, cancellationToken]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#ffffff', 
      zIndex: 9999, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: 'sans-serif' 
    }}>
      <div className="cancel-card" style={{ 
        maxWidth: '500px', 
        width: '90%', 
        textAlign: 'center', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Appointment Management</h2>
        
        {status === 'loading' && (
          <p>Processing your cancellation request...</p>
        )}

        {status === 'success' && (
          <div style={{ color: '#28a745' }}>
            <p><strong>Appointment cancelled successfully</strong></p>
            <p style={{ color: '#666', fontSize: '14px' }}>The slot has been released for other donors.</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ color: '#dc3545' }}>
            <p><strong>There was an unexpected error and we couldn't cancel the appointment</strong></p>
            <p style={{ fontSize: '14px', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px' }}>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CancelAppointment;
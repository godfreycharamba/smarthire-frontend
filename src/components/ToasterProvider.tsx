
import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToasterProvider: React.FC = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          fontSize: '14px',
          maxWidth: '400px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#ffffff',
          },
          style: {
            background: '#065f46',
            color: '#ffffff',
            border: '1px solid #22c55e',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          style: {
            background: '#7f1d1d',
            color: '#ffffff',
            border: '1px solid #ef4444',
          },
        },
        loading: {
          style: {
            background: '#1e293b',
            color: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ToasterProvider;
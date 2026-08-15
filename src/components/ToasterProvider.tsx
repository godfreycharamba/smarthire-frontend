import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createPortal } from 'react-dom';

const ToasterProvider: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <Toaster
      position="bottom-right"
      containerStyle={{
        zIndex: 999999,
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          fontSize: '14px',
          width: 'auto',
          maxWidth: '600px', // Set a max width for very long messages
          minWidth: '250px',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.6',
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
            padding: '16px 24px',
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
            padding: '16px 24px',
          },
        },
        loading: {
          style: {
            background: '#1e293b',
            color: '#ffffff',
            padding: '16px 24px',
          },
        },
      }}
    />,
    document.body
  );
};

export default ToasterProvider;
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../store';

const FirebaseStatus: React.FC = () => {
  const { isConnected } = useAppStore();

  return (
    <AnimatePresence>
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            padding: '4px 8px',
            borderRadius: '6px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ExclamationTriangleIcon style={{ width: '12px', height: '12px', color: '#f87171' }} />
            <span style={{ fontSize: '10px', color: '#f87171', fontWeight: '500' }}>Offline</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FirebaseStatus;

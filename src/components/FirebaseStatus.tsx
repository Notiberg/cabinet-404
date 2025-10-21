import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../store';

const FirebaseStatus: React.FC = () => {
  const { isConnected } = useAppStore();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg glass-card ${
          isConnected ? 'border-green-500/30' : 'border-red-500/30'
        }`}
      >
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400">Подключено</span>
            </>
          ) : (
            <>
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400">Нет подключения</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FirebaseStatus;

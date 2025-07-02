'use client';

import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const ToastNotification: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showBackdrop, setShowBackdrop] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); 
      const hideTimer = setTimeout(() => {
        setShowBackdrop(false); 
        onClose(); 
      }, 200); 
      return () => clearTimeout(hideTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible && !showBackdrop) return null;

  let icon = null;
  let iconColor = '';
  let shadowColor = ''
  switch (type) {
    case 'success':
      iconColor = 'text-green-400'; 
      shadowColor = 'shadow-green-500/50'
      icon = <FaCheckCircle className={`text-5xl mb-4 ${iconColor} drop-shadow-lg ${shadowColor}`} />; 
      break;
    case 'error':
      iconColor = 'text-red-400'; 
      shadowColor = 'shadow-red-500/50'
      icon = <FaTimesCircle className={`text-5xl mb-4 ${iconColor} drop-shadow-lg ${shadowColor}`} />;
      break;
    case 'info':
      iconColor = 'text-blue-400';
      shadowColor = 'shadow-blue-500/50'
      icon = <FaInfoCircle className={`text-5xl mb-4 ${iconColor} drop-shadow-lg ${shadowColor}`} />;
      break;
    default:
      iconColor = 'text-gray-400';
      shadowColor = 'shadow-gray-500/50'
      icon = <FaInfoCircle className={`text-5xl mb-4 ${iconColor} drop-shadow-lg ${shadowColor}`} />;
  }

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black/30
          flex items-center justify-center 
          transition-opacity duration-300 
          ${showBackdrop ? 'visible opacity-100' : 'invisible opacity-0'} 
        `}
        style={{ zIndex: 999 }} 
      >
        <div
          className={`
            relative 
            bg-gray-800 
            text-blue-100
            p-8 rounded-lg shadow-lg shadow-blue-500/50 border border-blue-700
            flex flex-col items-center justify-center 
            max-w-xs w-full 
            transform transition-all duration-300 ease-out 
            ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'} 
          `}
          style={{ zIndex: 1000 }} 
        >

          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setShowBackdrop(false); 
                onClose(); 
              }, 200);
            }}
            className="absolute top-3 right-3 p-1 rounded-lg text-blue-300 bg-transparent hover:bg-blue-700 hover:text-blue-100 focus:outline-none" 
          >
            <FaTimes className="text-xl" />
          </button>

          {icon}

          <span className="text-center text-xl font-semibold mt-2">{message}</span> 
        </div>
      </div>
    </>
  );
};

export default ToastNotification;
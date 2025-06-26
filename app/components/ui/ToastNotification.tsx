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
      }, 300); 
      return () => clearTimeout(hideTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible && !showBackdrop) return null;

  let icon = null;
  let iconColor = '';
  switch (type) {
    case 'success':
      iconColor = 'text-green-600'; 
      icon = <FaCheckCircle className={`text-5xl mb-4 ${iconColor}`} />; 
      break;
    case 'error':
      iconColor = 'text-red-600'; 
      icon = <FaTimesCircle className={`text-5xl mb-4 ${iconColor}`} />;
      break;
    case 'info':
      iconColor = 'text-blue-600';
      icon = <FaInfoCircle className={`text-5xl mb-4 ${iconColor}`} />;
      break;
    default:
      iconColor = 'text-gray-600';
      icon = <FaInfoCircle className={`text-5xl mb-4 ${iconColor}`} />;
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
            bg-white 
            text-gray-800 
            p-8 rounded-lg shadow-2xl 
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
              }, 300);
            }}
            className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none" 
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
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50/90 border-green-200 text-green-800 shadow-green-100';
      case 'error':
        return 'bg-red-50/90 border-red-200 text-red-800 shadow-red-100';
      case 'warning':
        return 'bg-yellow-50/90 border-yellow-200 text-yellow-800 shadow-yellow-100';
      default:
        return 'bg-blue-50/90 border-blue-200 text-blue-800 shadow-blue-100';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`
        flex items-center space-x-3 p-4 rounded-xl border-2 shadow-xl backdrop-blur-lg max-w-sm
        ${getColorClasses()}
      `}>
        {getIcon()}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-1 rounded-lg hover:bg-black/10 transition-colors duration-200"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

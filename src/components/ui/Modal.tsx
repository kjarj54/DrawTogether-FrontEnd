import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'modal-sm';
      case 'lg': return 'modal-lg';
      default: return '';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Solo cerrar si el click es exactamente en el backdrop, no en el contenido
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      {/* Modal */}
      <div className={`modal-content ${getSizeClass()} ${className || ''}`}>
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{padding: '4px', width: '32px', height: '32px'}}
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
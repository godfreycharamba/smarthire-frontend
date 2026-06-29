// components/SignOutModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, X, AlertCircle } from 'lucide-react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Call the optional onConfirm callback if provided
    if (onConfirm) {
      onConfirm();
    }
    // Always navigate to sign-in
    navigate('/sign-in');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-full">
              <LogOut className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start space-x-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Are you sure you want to sign out?</p>
              <p className="text-sm text-yellow-700 mt-1">
                You'll need to sign in again to access your account and activities.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center space-x-2">
             
              
            </p>
            <p className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              <span>You'll be redirected to the sign-in page</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Yes, Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
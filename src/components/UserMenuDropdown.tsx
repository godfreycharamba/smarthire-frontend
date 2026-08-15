// components/UserMenuDropdown.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  ChevronDown,
  LogOut,
  UserCircle,
  Lock,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import authService from '../services/users_service';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  registration_date: string;
}

interface UserMenuDropdownProps {
  onSignOut: () => void;
}

// Modal component moved outside to prevent recreation
const ModalPortal: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({ children, isOpen }) => {
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {children}
    </div>,
    document.body
  );
};

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ onSignOut }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
  first_name: "",
  last_name: "",
  phone_number: "",
});
  
  // user form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFirstName(userData.first_name || '');
        setLastName(userData.last_name || '');
        setPhoneNumber(userData.phone_number || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showProfileModal || showPasswordModal || showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showProfileModal, showPasswordModal, showDeleteModal]);

  const getInitials = useCallback(() => {
    if (!user) return 'JD';
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase();
  }, [user]);

  const getFullName = useCallback(() => {
    if (!user) return 'User';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }, [user]);

  const validateName = (value: string) => {
  if (value === "") return true;

  return /^[A-Za-z\s]*$/.test(value) && /[A-Za-z]/.test(value);
};



const validatePhoneInput = (value: string) => {
  if (value === "") return true;

  return /^\+?[0-9]*$/.test(value);
};

const validatePhone = (value: string) => {
  return /^(07[0-9]{8}|\+2637[0-9]{8})$/.test(value);
};

 const handleUpdateUser = async () => {
  let hasErrors = false;

  if (!firstName.trim()) {
    setErrors((prev) => ({
      ...prev,
      first_name: "First name is required.",
    }));
    hasErrors = true;
  } else if (!validateName(firstName)) {
    setErrors((prev) => ({
      ...prev,
      first_name:
        "First name can only contain letters and spaces.",
    }));
    hasErrors = true;
  }

  if (!lastName.trim()) {
    setErrors((prev) => ({
      ...prev,
      last_name: "Last name is required.",
    }));
    hasErrors = true;
  } else if (!validateName(lastName)) {
    setErrors((prev) => ({
      ...prev,
      last_name:
        "Last name can only contain letters and spaces.",
    }));
    hasErrors = true;
  }

  if (!phoneNumber.trim()) {
    setErrors((prev) => ({
      ...prev,
      phone_number: "Phone number is required.",
    }));
    hasErrors = true;
  } else if (!validatePhone(phoneNumber)) {
    setErrors((prev) => ({
      ...prev,
      phone_number:
        "Phone number must be in the format 0712345678 or +263712345678.",
    }));
    hasErrors = true;
  }

    try {
    setLoading(true);

    const response = await authService.updateUser({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone_number: phoneNumber.trim(),
    });

    if (response.success && response.data) {
      const updatedUser = { ...user, ...response.data };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Account updated successfully!");

      setErrors({
        first_name: "",
        last_name: "",
        phone_number: "",
      });

      setShowProfileModal(false);
    } else {
      toast.error(response.message || "Failed to update account");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to update account");
  } finally {
    setLoading(false);
  }
};

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (response.success) {
        toast.success('Password changed successfully!');
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const response = await authService.deleteUser();

      if (response.success) {
        toast.success('Account deleted successfully');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/sign-in';
      } else {
        toast.error(response.message || 'Failed to delete account');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Input change handlers with useCallback
  const handleFirstNameChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (validateName(value)) {
      setFirstName(value);

      setErrors((prev) => ({
        ...prev,
        first_name: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        first_name:
          "First name can only contain letters and spaces.",
      }));
    }
  },
  []
);

const handleLastNameChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (validateName(value)) {
      setLastName(value);

      setErrors((prev) => ({
        ...prev,
        last_name: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        last_name:
          "Last name can only contain letters and spaces.",
      }));
    }
  },
  []
);

const handlePhoneChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (validatePhoneInput(value)) {
      setPhoneNumber(value);

      setErrors((prev) => ({
        ...prev,
        phone_number: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        phone_number:
          "Phone number can only contain numbers and must start with 07 or +2637.",
      }));
    }
  },
  []
);

  const handleOldPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  }, []);

  const handleNewPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }, []);

  const toggleOldPassword = useCallback(() => {
    setShowOldPassword(prev => !prev);
  }, []);

  const toggleNewPassword = useCallback(() => {
    setShowNewPassword(prev => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const closeProfileModal = useCallback(() => {
    setShowProfileModal(false);
  }, []);

  const closePasswordModal = useCallback(() => {
    setShowPasswordModal(false);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const openProfileModal = useCallback(() => {
    setShowProfileModal(true);
    setIsUserMenuOpen(false);
  }, []);

  const openPasswordModal = useCallback(() => {
    setShowPasswordModal(true);
    setIsUserMenuOpen(false);
  }, []);

  const openDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
    setIsUserMenuOpen(false);
  }, []);

  const handleSignOut = useCallback(() => {
    setIsUserMenuOpen(false);
    onSignOut();
  }, [onSignOut]);

  const toggleMenu = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <div className="relative" ref={menuRef}>
        <div 
          className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggleMenu}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getInitials()}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-900">{getFullName()}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              <span className="text-xs text-blue-600 font-medium capitalize mt-1 inline-block">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
            
            <div className="py-2">
              <button
                onClick={openProfileModal}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserCircle className="h-4 w-4" />
                <span>Update Account</span>
              </button>
              <button
                onClick={openPasswordModal}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </button>
              <button
                onClick={openDeleteModal}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
            
            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Update Profile Modal - Using Portal */}
      <ModalPortal isOpen={showProfileModal}>
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
            <button onClick={closeProfileModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={handleFirstNameChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.first_name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.first_name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={handleLastNameChange}
               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.last_name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.last_name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.phone_number
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              />
               {errors.phone_number && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone_number}
                </p>
              )}
            </div>
            <button
              onClick={handleUpdateUser}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </ModalPortal>

      {/* Change Password Modal - Using Portal */}
      <ModalPortal isOpen={showPasswordModal}>
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            <button onClick={closePasswordModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={toggleOldPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={toggleNewPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
              <span>{loading ? 'Changing...' : 'Change Password'}</span>
            </button>
          </div>
        </div>
      </ModalPortal>

      {/* Delete Account Modal - Using Portal */}
      <ModalPortal isOpen={showDeleteModal}>
        <div className="bg-white rounded-2xl max-w-md w-full relative">
          <div className="p-6">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <Trash2 className="h-8 w-8" />
              <h2 className="text-xl font-bold">Delete Account</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>{loading ? 'Deleting...' : 'Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>
    </>
  );
};

export default UserMenuDropdown;
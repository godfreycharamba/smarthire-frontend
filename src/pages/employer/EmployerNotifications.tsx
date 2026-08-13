// pages/employer/components/EmployerNotifications.tsx
import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  Clock,
  Loader2,
  Eye,
  Send,
  User,
  X,
  Trash2,
  Calendar,
  UserCircle,
  Users
} from 'lucide-react';
import notificationService from '../../services/notifications_service';
import usersService from '../../services/users_service';
import { toast } from 'react-hot-toast';

const EmployerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [jobSeekers, setJobSeekers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getEmployerNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast.error(error.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobSeekers = async () => {
    try {
      setLoadingUsers(true);
      const response = await usersService.getJobSeekers();
      if (response.success && response.data) {
        setJobSeekers(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching job seekers:', error);
      toast.error(error.message || 'Failed to fetch job seekers');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOpenCreateModal = () => {
    fetchJobSeekers();
    setShowCreateModal(true);
    setFormData({
      user_id: '',
      title: '',
      message: '',
    });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setFormData({
      user_id: '',
      title: '',
      message: '',
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const createData: {
        user_id?: string | null;
        title: string;
        message: string;
      } = {
        title: formData.title,
        message: formData.message,
      };

      if (formData.user_id) {
        createData.user_id = formData.user_id;
      }

      const response = await notificationService.createNotification(createData);
      if (response.success) {
        toast.success('Notification sent successfully!');
        await fetchNotifications();
        handleCloseCreateModal();
      } else {
        toast.error(response.message || 'Failed to send notification');
      }
    } catch (error: any) {
      console.error('Error creating notification:', error);
      toast.error(error.message || 'Failed to send notification');
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeleteClick = (notificationId: string) => {
  setNotificationToDelete(notificationId);
  setShowDeleteModal(true);
  document.body.style.overflow = 'hidden';
};

const closeDeleteModal = () => {
  setShowDeleteModal(false);
  setNotificationToDelete(null);
  document.body.style.overflow = 'auto';
};

const confirmDelete = async () => {
  if (!notificationToDelete) return;
  
  try {
    setDeleting(notificationToDelete);
    const response = await notificationService.deleteNotification(notificationToDelete);
    if (response.success) {
      setNotifications(prev => prev.filter((n: any) => n.notification_id !== notificationToDelete));
      toast.success('Notification deleted successfully');
      closeDeleteModal();
    }
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete notification');
  } finally {
    setDeleting(null);
  }
};

  const handleViewDetails = (notification: any) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedNotification(null);
    document.body.style.overflow = 'auto';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage and send notifications to job seekers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Send className="h-5 w-5" />
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total</p>
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{notifications.length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">Unread</p>
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{unreadCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">Read</p>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">{notifications.filter((n: any) => n.is_read).length}</p>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications</h3>
          <p className="text-gray-500 text-sm">
            You haven't sent any notifications yet. Click "Send Notification" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => (
            <div
              key={notification.notification_id}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden ${
                !notification.is_read ? 'border-blue-300 bg-blue-50/30' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                      )}
                      <h4 className="text-base font-semibold text-gray-900">
                        {notification.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2 break-words">
                      {notification.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(notification.created_at)}
                      </span>
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {notification.recipient ? 'Specific User' : 'All Users'}
                      </span>
                      {notification.created_by && (
                        <span className="flex items-center">
                          <UserCircle className="h-3 w-3 mr-1" />
                          By: {notification.created_by.first_name} {notification.created_by.last_name}
                        </span>
                      )}
                      {notification.is_read && (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleViewDetails(notification)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                   <button
                        onClick={() => handleDeleteClick(notification.notification_id)}
                        disabled={deleting === notification.notification_id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                        >
                        {deleting === notification.notification_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Send Notification</h2>
              </div>
              <button
                onClick={handleCloseCreateModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient (Optional)
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">All Job Seekers</option>
                  {jobSeekers.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
                {loadingUsers && (
                  <p className="text-xs text-gray-400 mt-1">Loading users...</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Leave empty to send to all job seekers
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Notification title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Type your notification message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Notification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

     {/* View Details Modal */}
{showDetailsModal && selectedNotification && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Bell className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Notification Details</h2>
        </div>
        <button
          onClick={closeDetailsModal}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
          <p className="text-lg font-semibold text-gray-900">{selectedNotification.title}</p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Message</label>
          <p className="text-gray-700 leading-relaxed break-words">{selectedNotification.message}</p>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-4">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            selectedNotification.is_read
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {selectedNotification.is_read ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <Bell className="h-3 w-3" />
            )}
            <span>{selectedNotification.is_read ? 'Read' : 'Unread'}</span>
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
            <p className="text-gray-900">
              {selectedNotification.created_by?.first_name} {selectedNotification.created_by?.last_name}
            </p>
            <p className="text-sm text-gray-500">{selectedNotification.created_by?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
            <p className="text-gray-900">{formatFullDate(selectedNotification.created_at)}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">Recipient</label>
            {selectedNotification.recipient ? (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-1">
                  <UserCircle className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-700">Specific User</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span> {selectedNotification.recipient.first_name} {selectedNotification.recipient.last_name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {selectedNotification.recipient.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> {selectedNotification.recipient.phone_number || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">All Users</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={closeDetailsModal}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Close
          </button>
          <button
            onClick={() => {
                closeDetailsModal();
                handleDeleteClick(selectedNotification.notification_id);
            }}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
            </button>
        </div>
      </div>
    </div>
  </div>
)}

{showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <Trash2 className="h-8 w-8" />
          <h2 className="text-xl font-bold">Delete Notification</h2>
        </div>
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete this notification?
        </p>
        <p className="text-gray-500 text-sm mb-6">
          This action cannot be undone and the notification will be permanently removed.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={closeDeleteModal}
            disabled={deleting !== null}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleting !== null}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete Notification</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default EmployerNotifications;
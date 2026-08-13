// components/NotificationsDropdown.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bell,
  X,
  CheckCircle,
  Clock,
  Loader2,
  Eye,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import notificationService from '../services/notifications_service';
import { toast } from 'react-hot-toast';

interface Notification {
  notification_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  recipient: string;
}

interface NotificationsDropdownProps {
  onNotificationCountChange?: (count: number) => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onNotificationCountChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationService.getMyNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
        const unread = response.data.filter((n: Notification) => !n.is_read).length;
        setUnreadCount(unread);
        if (onNotificationCountChange) {
          onNotificationCountChange(unread);
        }
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [onNotificationCountChange]);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (!showAllNotifications) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAllNotifications]);

  // Prevent body scroll when viewing all notifications
  useEffect(() => {
    if (showAllNotifications) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAllNotifications]);

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setMarkingRead(notificationId);
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => 
            n.notification_id === notificationId 
              ? { ...n, is_read: true } 
              : n
          )
        );
        const newUnreadCount = unreadCount - 1;
        setUnreadCount(newUnreadCount);
        if (onNotificationCountChange) {
          onNotificationCountChange(newUnreadCount);
        }
        toast.success('Notification marked as read');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark notification as read');
    } finally {
      setMarkingRead(null);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      for (const notification of unreadNotifications) {
        await notificationService.markAsRead(notification.notification_id);
      }
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      if (onNotificationCountChange) {
        onNotificationCountChange(0);
      }
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  // Notification List Component
  const NotificationList = ({ items }: { items: Notification[] }) => (
    <div className="divide-y divide-gray-100">
      {items.map((notification) => (
        <div 
          key={notification.notification_id} 
          className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
            !notification.is_read ? 'bg-blue-50/50' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                {!notification.is_read && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                )}
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {notification.title}
                </h4>
              </div>
              <p className="text-sm text-gray-600 mt-1 break-words">
                {notification.message}
              </p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(notification.created_at)}
                </span>
                {notification.is_read && (
                  <span className="text-xs text-gray-400 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Read
                  </span>
                )}
              </div>
            </div>
            {!notification.is_read && (
              <button
                onClick={() => handleMarkAsRead(notification.notification_id)}
                disabled={markingRead === notification.notification_id}
                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
                title="Mark as read"
              >
                {markingRead === notification.notification_id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Notification Bell Button */}
        <button 
            onClick={toggleDropdown}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
            </button>

        {/* Notifications Dropdown */}
        {isOpen && !showAllNotifications && (
          <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white rounded-xl shadow-lg border border-gray-200 z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={markingAll}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 disabled:opacity-50"
                  >
                    {markingAll ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCheck className="h-3 w-3" />
                    )}
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <Bell className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm font-medium">No notifications yet</p>
                  <p className="text-gray-400 text-xs">You'll see notifications here when you receive them</p>
                </div>
              ) : (
                <NotificationList items={notifications.slice(0, 5)} />
              )}
            </div>

            {/* Footer */}
            {notifications.length > 5 && (
              <div className="px-4 py-3 border-t border-gray-200 text-center">
                <button 
                  onClick={() => setShowAllNotifications(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all {notifications.length} notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* All Notifications Modal */}
      {showAllNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAllNotifications(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">All Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={markingAll}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    {markingAll ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCheck className="h-4 w-4" />
                    )}
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setShowAllNotifications(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <Bell className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No notifications yet</p>
                  <p className="text-gray-400 text-sm">You'll see notifications here when you receive them</p>
                </div>
              ) : (
                <NotificationList items={notifications} />
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
                Total: {notifications.length} notifications · {unreadCount} unread
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationsDropdown;
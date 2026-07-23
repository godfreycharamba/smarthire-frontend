import api from './api';

interface NotificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface CreateNotificationData {
  user_id?: string | null;
  title: string;
  message: string;
}

const notificationService = {
  // Create notification
  createNotification: async (data: CreateNotificationData): Promise<NotificationResponse> => {
    try {
      const response = await api.post<NotificationResponse>('/notifications/create', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating notification:', error);
      throw new Error(error.response?.data?.message || 'Failed to create notification');
    }
  },

   // Get my notifications
  getMyNotifications: async (): Promise<NotificationResponse> => {
    try {
      const response = await api.get<NotificationResponse>('/notifications/mine');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  // Get notification by ID
getNotificationById: async (notificationId: string): Promise<NotificationResponse> => {
  try {
    const response = await api.get<NotificationResponse>(`/notifications/${notificationId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching notification:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch notification');
  }
},

// Mark notification as read
markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
  try {
    const response = await api.put<NotificationResponse>(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
},

// Get all notifications
getAllNotifications: async (): Promise<NotificationResponse> => {
  try {
    const response = await api.get<NotificationResponse>('/notifications');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching all notifications:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
},

// Delete notification
deleteNotification: async (notificationId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(`/notifications/${notificationId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete notification');
  }
},

  
};

export default notificationService;
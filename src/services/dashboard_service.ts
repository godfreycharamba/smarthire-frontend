import api from './api';

interface DashboardResponse {
  success: boolean;
  message: string;
  data?: any;
}

const dashboardService = {
  // Get employer dashboard
  getEmployerDashboard: async (): Promise<DashboardResponse> => {
    try {
      const response = await api.get<DashboardResponse>('/dashboard/employer');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching employer dashboard:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch employer dashboard');
    }
  },

  // Get jobseeker dashboard
  getJobseekerDashboard: async (): Promise<DashboardResponse> => {
    try {
      const response = await api.get<DashboardResponse>('/dashboard/jobseeker');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching jobseeker dashboard:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch jobseeker dashboard');
    }
  },

  // Add more dashboard services here
};

export default dashboardService;
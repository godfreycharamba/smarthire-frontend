import api from './api';

interface ApplicationResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface CreateApplicationData {
  job_id: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
}

const applicationService = {
  // Create application
  createApplication: async (data: CreateApplicationData): Promise<ApplicationResponse> => {
    try {
      const response = await api.post<ApplicationResponse>('/applications/create', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating application:', error);
      throw new Error(error.response?.data?.message || 'Failed to create application');
    }
  },

  // Get all applications
  getApplications: async (): Promise<ApplicationResponse> => {
  try {
    const response = await api.get<ApplicationResponse>('/applications');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching all applications:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch applications');
  }
},

  getJobSeekerApplications: async (): Promise<ApplicationResponse> => {
    try {
      const response = await api.get<ApplicationResponse>('/applications/mine');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch applications');
    }
  },

  // Get application by ID
getApplicationById: async (application_id: string): Promise<ApplicationResponse> => {
  try {
    const response = await api.get<ApplicationResponse>(`/applications/${application_id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching application:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch application');
  }
},

 // Get applications by job ID
  getApplicationsByJob: async (jobId: string): Promise<ApplicationResponse> => {
    try {
      const response = await api.get<ApplicationResponse>(`/applications/job/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching applications by job:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch applications for this job');
    }
  },

  // Update application status
updateStatus: async (application_id: string, data: { status: 'submitted' | 'reviewed' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected' }): Promise<ApplicationResponse> => {
  try {
    const response = await api.patch<ApplicationResponse>(`/applications/${application_id}/status`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating application status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update application status');
  }
},

// Delete application
deleteApplication: async (applicationId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(`/applications/${applicationId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting application:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete application');
  }
},

  
};

export default applicationService;
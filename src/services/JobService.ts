import api from './api';

interface JobResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface CreateJobData {
  title: string;
  location: string;
  salary: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';
  description: string;
  required_skills: string;
  required_experience: string;
  required_education: string;
  deadline: string;
  status: 'active' | 'inactive' | 'closed';

}

interface JobResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface JobsResponse {
  success: boolean;
  message: string;
  data: Job[];
}

interface Job {
  job_id: string;
  employer_profile: {
    profile_id: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      role: string;
      registration_date: string;
    };
    company_name: string;
    company_website: string;
    location: string;
    company_description: string;
    company_logo_url: string;
    created_at: string;
    updated_at: string;
  };
  title: string;
  location: string;
  salary: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';
  description: string;
  required_skills: string;
  required_experience: string;
  required_education: string;
  deadline: string;
  status: 'active' | 'inactive' | 'draft' | 'closed';
  posted_date: string;
  updated_at: string;
}

interface UpdateJobData {
  title: string;
  location: string;
  salary: string;
  job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';
  description: string;
  required_skills: string;
  required_experience: string;
  required_education: string;
  deadline: string;
  status: 'active' | 'inactive' | 'draft' | 'closed';
}


const jobService = {
  // Create job
  createJob: async (data: CreateJobData): Promise<JobResponse> => {
    try {
      const response = await api.post<JobResponse>('/jobs/create', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating job:', error);
      throw new Error(error.response?.data?.message || 'Failed to create job');
    }
  },

  getJobs: async (): Promise<JobsResponse> => {
    try {
      const response = await api.get<JobsResponse>('/jobs');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
    }
  },

   getJobById: async (jobId: string): Promise<JobResponse> => {
    try {
      const response = await api.get<JobResponse>(`/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching job:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch job');
    }
  },
 updateJob: async (jobId: string, data: UpdateJobData): Promise<JobResponse> => {
    try {
      const response = await api.put<JobResponse>(`/jobs/${jobId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating job:', error);
      throw new Error(error.response?.data?.message || 'Failed to update job');
    }
  },

  publishJob: async (job_id: string): Promise<JobResponse> => {
  try {
    const response = await api.post<JobResponse>(`/jobs/${job_id}/publish`);
    return response.data;
  } catch (error: any) {
    console.error('Error publishing job:', error);
    throw new Error(error.response?.data?.message || 'Failed to publish job');
  }
},

// Delete job
deleteJob: async (job_id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(`/jobs/${job_id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting job:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete job');
  }
},

  
};

export default jobService;
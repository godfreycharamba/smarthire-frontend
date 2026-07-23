import api from './api';
import { supabase } from '../lib/supabase';

interface JobseekerProfileResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface CreateProfileData {
  title: string;
  bio: string;
  profile_pic?: File;
  resume?: File;
}

const jobseekerService = {
  // Upload profile picture to Supabase
  uploadProfilePicture: async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `profile-pics/${fileName}`;

    const { error } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  },

  // Create jobseeker profile
  createProfile: async (data: CreateProfileData): Promise<JobseekerProfileResponse> => {
    const formData = new FormData();
    
    // Upload profile picture if provided and get URL
    if (data.profile_pic) {
      const profilePicUrl = await jobseekerService.uploadProfilePicture(data.profile_pic);
      formData.append('profile_pic_url', profilePicUrl);
    }

    // Append resume file directly
    if (data.resume) {
      formData.append('resume', data.resume);
    }

    // Append text fields
    formData.append('title', data.title);
    formData.append('bio', data.bio);

    const response = await api.post<JobseekerProfileResponse>(
      '/jobseeker-profile/create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  // Get my profile
getMyProfile: async (): Promise<JobseekerProfileResponse> => {
  try {
    const response = await api.get<JobseekerProfileResponse>('/jobseeker-profile/me');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching my profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
},

  // Get jobseeker profile by profile ID
getProfileById: async (profileId: string): Promise<JobseekerProfileResponse> => {
  try {
    const response = await api.get<JobseekerProfileResponse>(`/jobseeker-profile/${profileId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching jobseeker profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch jobseeker profile');
  }
},

// Update jobseeker profile
updateProfile: async (data: {
  title?: string;
  bio?: string;
  profile_pic?: File;
  resume?: File;
}): Promise<JobseekerProfileResponse> => {
  try {
    const formData = new FormData();
    
    // Upload new profile picture if provided and get URL
    if (data.profile_pic) {
      const profilePicUrl = await jobseekerService.uploadProfilePicture(data.profile_pic);
      formData.append('profile_pic_url', profilePicUrl);
    }

    // Append resume file directly if provided
    if (data.resume) {
      formData.append('resume', data.resume);
    }

    // Append text fields if provided
    if (data.title) formData.append('title', data.title);
    if (data.bio) formData.append('bio', data.bio);

    const response = await api.put<JobseekerProfileResponse>(
      '/jobseeker-profile/update',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
},

// Delete my profile
deleteMyProfile: async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>('/jobseeker-profile/delete');
    return response.data;
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete profile');
  }
},


};

export default jobseekerService;
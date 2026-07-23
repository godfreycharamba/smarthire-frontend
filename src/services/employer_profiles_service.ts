import api from './api';
import { supabase } from '../lib/supabase';

interface EmployerProfileResponse {
  success: boolean;
  message: string;
  data?: {
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
}

interface CreateEmployerProfileData {
  company_name: string;
  company_website: string;
  location: string;
  company_description: string;
  company_logo?: File;
}

const employerService = {
  // Upload company logo to Supabase
  uploadCompanyLogo: async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;

      const { error } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (error) throw new Error(error.message);

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading company logo:', error);
      throw new Error('Failed to upload company logo');
    }
  },

  // Create employer profile
  createProfile: async (data: CreateEmployerProfileData): Promise<EmployerProfileResponse> => {
    try {
      let companyLogoUrl = '';

      // Upload company logo if provided
      if (data.company_logo) {
        companyLogoUrl = await employerService.uploadCompanyLogo(data.company_logo);
      }

      // Send data to backend
      const response = await api.post<EmployerProfileResponse>(
        '/employer-profile/create',
        {
          company_name: data.company_name,
          company_website: data.company_website,
          location: data.location,
          company_description: data.company_description,
          company_logo_url: companyLogoUrl,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error creating employer profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to create employer profile');
    }
  },

  // Get employer profile
  getProfile: async (): Promise<EmployerProfileResponse> => {
    try {
      const response = await api.get<EmployerProfileResponse>('/employer-profile');
      return response.data;
    } 
    catch (error: any) {
      console.error('Error fetching employer profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch employer profile');
    }
  },

  // Update employer profile
updateProfile: async (data: {
  company_name: string;
  company_website: string;
  location: string;
  company_description: string;
  company_logo?: File;
}): Promise<EmployerProfileResponse> => {
  try {
    let companyLogoUrl = '';

    // Upload new company logo if provided
    if (data.company_logo) {
      companyLogoUrl = await employerService.uploadCompanyLogo(data.company_logo);
    }

    // Send data to backend
    const response = await api.put<EmployerProfileResponse>(
      '/employer-profile/update',
      {
        company_name: data.company_name,
        company_website: data.company_website,
        location: data.location,
        company_description: data.company_description,
        company_logo_url: companyLogoUrl || undefined,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating employer profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update employer profile');
  }
},

// Delete employer profile
deleteProfile: async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(
      '/employer-profile/delete'
    );
    return response.data;
  } catch (error: any) {
    console.error('Error deleting employer profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete employer profile');
  }
},
  
};

export default employerService;

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: 'employer' | 'job-seeker';
  registration_date: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: 'employer' | 'job_seeker';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access: string;
    refresh: string;
  };
}
import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Upload,
  FileText,
  Camera,
  CheckCircle,
  Loader2,
  AlertCircle,
  Plus,
  User,
  Trash2,
} from 'lucide-react';
import jobseekerService from '../../services/jobseekerprofiles_service';
import { toast } from 'react-hot-toast';

interface ProfileData {
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
  profile_pic_url: string;
  resume_url: string;
  title: string;
  bio: string;
  skills: string[];
  experience: any[];
  education: any[];
  processing_status: string;
  created_at: string;
  updated_at: string;
}

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
 const [isDeleting, setIsDeleting] = useState(false);
 const [errors, setErrors] = useState({
  title: "",
  bio: "",
});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      
      setLoading(true);
      const response = await jobseekerService.getMyProfile();
      
      if (response.success && response.data && response.data.profile_id) {
        console.log('✅ Profile data received:', response.data);
      console.log('🔗 Profile pic URL:', response.data.profile_pic_url);
        setProfile(response.data);
        setTitle(response.data.title || '');
        setBio(response.data.bio || '');
        setPreviewUrl(response.data.profile_pic_url || '');
      } else {
        
        setProfile(null);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // If 404 or profile not found, just set profile to null
      if (error.response?.status === 404) {
        setProfile(null);
      } else {
        toast.error(error.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateTitle = (value: string) => {

  if (value === "") return true;

 
  return /^[A-Za-z\s]*$/.test(value) && /[A-Za-z]/.test(value);
};

const validateBio = (value: string) => {
 
  if (value === "") return true;

 
  return /^[A-Za-z0-9\s,.]*$/.test(value) && /[A-Za-z]/.test(value);
};

 const handleTitleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = e.target.value;

  if (validateTitle(value)) {
    setTitle(value);

    setErrors((prev) => ({
      ...prev,
      title: "",
    }));
  } else {
    setErrors((prev) => ({
      ...prev,
      title: "Title can only contain letters and spaces.",
    }));
  }
};

const handleBioChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => {
  const value = e.target.value;

  if (validateBio(value)) {
    setBio(value);

    setErrors((prev) => ({
      ...prev,
      bio: "",
    }));
  } else {
    setErrors((prev) => ({
      ...prev,
      bio: "Bio can only contain letters, spaces, numbers, commas and full stops, and must contain at least one letter.",
    }));
  }
};

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      toast.success(`Resume "${e.target.files[0].name}" selected`);
    }
  };

  const handleCreateProfile = async () => {
    try {
      setIsUploading(true);
      
      // Validate required fields
      if (!title) {
        toast.error('Please enter your professional title');
        setIsUploading(false);
        return;
      }

      const createData: {
        title: string;
        bio: string;
        profile_pic?: File;
        resume?: File;
      } = {
        title: title,
        bio: bio || '',
      };

      if (profilePicFile) createData.profile_pic = profilePicFile;
      if (resumeFile) createData.resume = resumeFile;

      const response = await jobseekerService.createProfile(createData);
      
      if (response.success) {
        toast.success('Profile created successfully!');
        await fetchProfile();
        setIsCreating(false);
        setProfilePicFile(null);
        setResumeFile(null);
      } else {
        toast.error(response.message || 'Failed to create profile');
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 90) {
          clearInterval(interval);
        }
      }, 200);

      const updateData: {
        title?: string;
        bio?: string;
        profile_pic?: File;
        resume?: File;
      } = {};

      if (title !== profile?.title) updateData.title = title;
      if (bio !== profile?.bio) updateData.bio = bio;
      if (profilePicFile) updateData.profile_pic = profilePicFile;
      if (resumeFile) updateData.resume = resumeFile;

      const response = await jobseekerService.updateProfile(updateData);
      
      setUploadProgress(100);
      
      if (response.success) {
        toast.success('Profile updated successfully!');
        await fetchProfile();
        setIsEditing(false);
        setProfilePicFile(null);
        setResumeFile(null);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTitle(profile?.title || '');
    setBio(profile?.bio || '');
    setPreviewUrl(profile?.profile_pic_url || '');
    setProfilePicFile(null);
    setResumeFile(null);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setTitle('');
    setBio('');
    setPreviewUrl('');
    setProfilePicFile(null);
    setResumeFile(null);
  };

  const handleDeleteProfile = async () => {
  try {
    setIsDeleting(true);
    const response = await jobseekerService.deleteMyProfile();
    
    if (response.success) {
      toast.success('Profile deleted successfully!');
      setProfile(null);
      setTitle('');
      setBio('');
      setPreviewUrl('');
      setProfilePicFile(null);
      setResumeFile(null);
      setIsEditing(false);
      setShowDeleteModal(false);
    } else {
      toast.error(response.message || 'Failed to delete profile');
    }
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    toast.error(error.message || 'Failed to delete profile');
  } finally {
    setIsDeleting(false);
  }
};

const openDeleteModal = () => {
  setShowDeleteModal(true);
};

const closeDeleteModal = () => {
  if (!isDeleting) {
    setShowDeleteModal(false);
  }
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show create profile form
  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Profile</h2>
            <p className="text-gray-500 text-sm mt-1">
              Set up your professional profile to start applying for jobs
            </p>
          </div>
          <button
            onClick={cancelCreate}
            className="flex items-center space-x-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
          >
            <X className="h-5 w-5" />
            <span>Cancel</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleCreateProfile(); }} className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 p-2 bg-blue-600 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-colors text-white">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Senior Software Engineer"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={handleBioChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${
                  errors.bio ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.bio}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {resumeFile ? 'Change Resume' : 'Upload Resume'}
                    </span>
                  </div>
                </label>
                {resumeFile && (
                  <span className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {resumeFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={cancelCreate}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Create Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // No profile found - show create profile button
  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            View and manage your personal information
          </p>
        </div>
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Profile Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You haven't created your professional profile yet. Create one to start applying for jobs.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create Profile</span>
          </button>
        </div>
      </div>
    );
  }

  // Show existing profile
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            View and manage your personal information
          </p>
        </div>
       {!isEditing ? (
  <div className="flex gap-3">
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
    >
      <Edit className="h-5 w-5" />
      <span>Edit Profile</span>
    </button>
    <button
      onClick={openDeleteModal}
      disabled={isUploading}
      className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
    >
      <Trash2 className="h-5 w-5" />
      <span>Delete Profile</span>
    </button>
  </div>
) : (
  <div className="flex items-center space-x-3">
    <button
      onClick={cancelEdit}
      disabled={isUploading}
      className="flex items-center space-x-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
    >
      <X className="h-5 w-5" />
      <span>Cancel</span>
    </button>
    <button
      onClick={handleSave}
      disabled={isUploading}
      className="flex items-center space-x-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
    >
      {isUploading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </>
      )}
    </button>
  </div>
)}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading...</span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Profile Header with Avatar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30 overflow-hidden">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                `${profile.user.first_name.charAt(0)}${profile.user.last_name.charAt(0)}`
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full border-2 border-white hover:bg-blue-600 transition-colors cursor-pointer">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {profile.user.first_name} {profile.user.last_name}
            </h1>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                 className={`mt-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white placeholder-white/60 border ${
                    errors.title
                      ? "border-red-400"
                      : "border-white/30"
                  } focus:outline-none focus:ring-2 focus:ring-white/50`}
                placeholder="Your professional title"
              />
            ) : (
              <p className="text-blue-100">{profile.title || 'No title set'}</p>
            )}
            {errors.title && (
                <p className="mt-1 text-sm text-red-200">
                  {errors.title}
                </p>
              )}
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-blue-100">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.user.phone_number || 'No phone set'}
              </span>
              <span className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {profile.user.email}
              </span>
              <span className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {profile.user.phone_number || 'No phone set'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
              {profile.user.role.replace('_', ' ')}
            </span>
            <p className="text-xs text-blue-100 mt-1">
              Member since {formatDate(profile.user.registration_date)}
            </p>
          </div>
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Resume</h3>
              <p className="text-sm text-gray-500">
                {profile.resume_url ? 'Your resume is uploaded' : 'No resume uploaded'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {profile.resume_url && !isEditing && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Resume
              </a>
            )}
            {isEditing && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleResumeChange}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {resumeFile ? 'Change Resume' : 'Upload Resume'}
                  </span>
                </div>
              </label>
            )}
          </div>
        </div>
        {resumeFile && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>{resumeFile.name} selected</span>
          </div>
        )}
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
        {isEditing ? (
          <textarea
            value={bio}
            onChange={handleBioChange}
            rows={4}
             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.bio ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-gray-700 leading-relaxed">
            {profile.bio || 'No bio provided yet.'}
          </p>
        )}
        {errors.bio && (
            <p className="mt-1 text-sm text-red-500">
              {errors.bio}
            </p>
          )}
      </div>

      {/* Personal Information (Read-only) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
            <p className="text-gray-900">{profile.user.first_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
            <p className="text-gray-900">{profile.user.last_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-gray-900">{profile.user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
            <p className="text-gray-900">{profile.user.phone_number || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
            <p className="text-gray-900 capitalize">{profile.user.role.replace('_', ' ')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
            <p className="text-gray-900">{formatDate(profile.user.registration_date)}</p>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={closeDeleteModal}
    />
    
    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <Trash2 className="h-8 w-8 text-red-600" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
        Delete Profile
      </h3>

      {/* Message */}
      <p className="text-gray-600 text-center mb-6">
        Are you sure you want to delete your profile? This action will permanently remove all your profile data, including your resume, profile picture, and personal information. This cannot be undone.
      </p>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            All your job applications and saved positions will also be lost.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={closeDeleteModal}
          disabled={isDeleting}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteProfile}
          disabled={isDeleting}
          className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <Trash2 className="h-5 w-5" />
              <span>Yes, Delete Profile</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default MyProfile;
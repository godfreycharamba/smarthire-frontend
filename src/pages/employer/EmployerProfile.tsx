// pages/employer/components/CompanyProfile.tsx
import React, { useState, useEffect } from "react";
import {
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Camera,
  Loader2,
  CheckCircle,
  User,
  Plus,
  Trash2,
} from "lucide-react";
import employerService from "../../services/employer_profiles_service";
import { toast } from "react-hot-toast";

interface CompanyProfileData {
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
}

const EmployerProfile: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({
  company_name: "",
  location: "",
  company_description: "",
});

  // Form state - only company fields
  const [formData, setFormData] = useState({
    company_name: "",
    company_website: "",
    location: "",
    company_description: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await employerService.getProfile();
      if (response.success && response.data && response.data.profile_id) {
        setProfile(response.data);
        setFormData({
          company_name: response.data.company_name || "",
          company_website: response.data.company_website || "",
          location: response.data.location || "",
          company_description: response.data.company_description || "",
        });
        setPreviewUrl(response.data.company_logo_url || "");
      } else {
        // No profile found
        setProfile(null);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      // If 404 or profile not found, just set profile to null
      if (error.response?.status === 404) {
        setProfile(null);
      } else {
        toast.error(error.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setDeleting(true);
      const response = await employerService.deleteProfile();
      if (response.success) {
        toast.success("Company profile deleted successfully");
        setProfile(null);
        setIsEditing(false);
        setShowDeleteModal(false);
        setFormData({
          company_name: "",
          company_website: "",
          location: "",
          company_description: "",
        });
        setPreviewUrl("");
        setLogoFile(null);
      } else {
        toast.error(response.message || "Failed to delete profile");
      }
    } catch (error: any) {
      console.error("Error deleting profile:", error);
      toast.error(error.message || "Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  };

  const validateCompanyName = (value: string) => {
  if (value === "") return true;

   return /^[A-Za-z0-9\s'-]*$/.test(value) && /[A-Za-z]/.test(value);
};

const validateLocation = (value: string) => {
  if (value === "") return true;

    return /^[A-Za-z\s,]*$/.test(value);
};

const validateDescription = (value: string) => {
  if (value === "") return true;

 
  return (
    /^[A-Za-z\s,.'"“”‘’]*$/.test(value) &&
    /[A-Za-z]/.test(value)
  );
};

  const handleFormChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  if (name === "company_name") {
    if (validateCompanyName(value)) {
      setFormData((prev) => ({
        ...prev,
        company_name: value,
      }));

      setErrors((prev) => ({
        ...prev,
        company_name: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        company_name:
          "Company name must contain at least one letter and can only contain letters, numbers and spaces.",
      }));
    }
  }

  if (name === "location") {
    if (validateLocation(value)) {
      setFormData((prev) => ({
        ...prev,
        location: value,
      }));

      setErrors((prev) => ({
        ...prev,
        location: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        location:
          "Location can only contain letters, spaces and commas.",
      }));
    }
  }

  if (name === "company_description") {
    if (validateDescription(value)) {
      setFormData((prev) => ({
        ...prev,
        company_description: value,
      }));

      setErrors((prev) => ({
        ...prev,
        company_description: "",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        company_description:
          "Description must contain letters and can include spaces, commas, full stops and quotation marks.",
      }));
    }
  }
};

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company_name) {
      toast.error("Company name is required");
      return;
    }

    try {
      setSubmitting(true);

      const createData: {
        company_name: string;
        company_website: string;
        location: string;
        company_description: string;
        company_logo?: File;
      } = {
        company_name: formData.company_name,
        company_website: formData.company_website,
        location: formData.location,
        company_description: formData.company_description,
      };

      if (logoFile) {
        createData.company_logo = logoFile;
      }

      const response = await employerService.createProfile(createData);

      if (response.success) {
        toast.success("Company profile created successfully!");
        await fetchProfile();
        setIsCreating(false);
        setLogoFile(null);
      } else {
        toast.error(response.message || "Failed to create profile");
      }
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast.error(error.message || "Failed to create profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company_name) {
      toast.error("Company name is required");
      return;
    }

    try {
      setSubmitting(true);

      const updateData: {
        company_name: string;
        company_website: string;
        location: string;
        company_description: string;
        company_logo?: File;
      } = {
        company_name: formData.company_name,
        company_website: formData.company_website,
        location: formData.location,
        company_description: formData.company_description,
      };

      if (logoFile) {
        updateData.company_logo = logoFile;
      }

      const response = await employerService.updateProfile(updateData);

      if (response.success) {
        toast.success("Company profile updated successfully!");
        await fetchProfile();
        setIsEditing(false);
        setLogoFile(null);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
            <h2 className="text-2xl font-bold text-gray-900">
              Create Company Profile
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Set up your company information to start hiring
            </p>
          </div>
          <button
            onClick={() => setIsCreating(false)}
            className="flex items-center space-x-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
          >
            <X className="h-5 w-5" />
            <span>Cancel</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 p-2 bg-blue-600 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-colors text-white">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleFormChange}
                  placeholder="e.g. Tech Solutions Ltd"
                  className={`block w-full px-3 py-3 border rounded-lg outline-none ${
                    errors.company_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.company_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Harare, Zimbabwe"
                   className={`block w-full px-3 py-3 border rounded-lg outline-none ${
                    errors.location
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

               {errors.location && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.location}
                  </p>
                )} 
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleFormChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                name="company_description"
                value={formData.company_description}
                onChange={handleFormChange}
                rows={4}
                placeholder="Tell us about your company..."
                className={`block w-full px-3 py-3 border rounded-lg outline-none ${
                  errors.company_description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.company_description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.company_description}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
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
          <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your company information and branding
          </p>
        </div>
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Company Profile
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You haven't created a company profile yet. Create one to start
            posting jobs and hiring talent.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create Company Profile</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your company information and branding
          </p>
        </div>
        {!isEditing ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
            >
              <Trash2 className="h-5 w-5" />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  company_name: profile.company_name || "",
                  company_website: profile.company_website || "",
                  location: profile.location || "",
                  company_description: profile.company_description || "",
                });
                setPreviewUrl(profile.company_logo_url || "");
                setLogoFile(null);
              }}
              disabled={submitting}
              className="flex items-center space-x-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center space-x-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {submitting ? (
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

      {/* Company Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Cover Image / Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Company Logo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="h-12 w-12 text-white/70" />
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-blue-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1 text-white">
              {isEditing ? (
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleFormChange}
                  className="text-2xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 w-full max-w-md text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Company Name"
                />
              ) : (
                <h1 className="text-2xl font-bold">{profile.company_name}</h1>
              )}
              {/* User Info - READ ONLY */}
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-blue-100">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {profile.user?.first_name || ""}{" "}
                  {profile.user?.last_name || ""}
                </span>
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {profile.user?.email || ""}
                </span>
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {profile.user?.phone_number || ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          {/* Company Details - Editable */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleFormChange}
                    className={`block w-full px-3 py-3 border rounded-lg outline-none ${
                            errors.company_name
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                    required
                  />
                  
                ) : (
                  <p className="text-gray-900 font-medium">
                    {profile.company_name}
                  </p>
                )}
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.company_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className={`block w-full px-3 py-3 border rounded-lg outline-none ${
                      errors.location
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g. Harare, Zimbabwe"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {profile.location || "Not provided"}
                  </p>
                )}
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.location}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="company_website"
                    value={formData.company_website}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://example.com"
                  />
                ) : (
                  <p className="text-gray-900 flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-gray-400" />
                    {profile.company_website ? (
                      <a
                        href={profile.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.company_website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Company Description - Editable */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Company Description
            </label>
            {isEditing ? (
              <textarea
                name="company_description"
                value={formData.company_description}
                onChange={handleFormChange}
                rows={4}
                className={`block w-full px-3 py-3 border rounded-lg outline-none ${
                  errors.company_description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Tell us about your company..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {profile.company_description || "No description provided."}
              </p>
            )}
            {errors.company_description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.company_description}
              </p>
            )}
          </div>

          {/* User Information - READ ONLY */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900">
                  {profile.user?.first_name || ""}{" "}
                  {profile.user?.last_name || ""}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{profile.user?.email || ""}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone Number
                </label>
                <p className="text-gray-900">
                  {profile.user?.phone_number || ""}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {formatDate(profile.user?.registration_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Status */}
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Profile Active</span>
            </div>
            <span className="text-gray-400">
              Last updated: {formatDate(profile.updated_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <Trash2 className="h-8 w-8" />
                <h2 className="text-xl font-bold">Delete Company Profile</h2>
              </div>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete your company profile?
              </p>
              <p className="text-gray-500 text-sm mb-6">
                This action cannot be undone. All your job postings and company
                information will be permanently removed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProfile}
                  disabled={deleting}
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
                      <span>Delete Profile</span>
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

export default EmployerProfile;

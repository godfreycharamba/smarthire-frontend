import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Award,
  GraduationCap,
  Wrench,
  Globe,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Building,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jobService , {type Job } from "../../services/JobService";
import { toast } from "react-hot-toast";



const EmployerJobPostings: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [closingJob, setClosingJob] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    job_type: "full_time",
    description: "",
    required_skills: "",
    required_experience: "",
    required_education: "",
    deadline: "",
    status: "draft",
  });
  const jobsPerPage = 6;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getEmployerJobs();
      if (response.success && response.data) {
        setJobs(response.data);
      } else {
        toast.error("Failed to load jobs");
      }
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error(error.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPostModal = () => {
    setFormData({
      title: "",
      location: "",
      salary: "",
      job_type: "full_time",
      description: "",
      required_skills: "",
      required_experience: "",
      required_education: "",
      deadline: "",
      status: "draft",
    });
    setShowPostModal(true);
    document.body.style.overflow = "hidden";
  };


 const handleOpenEditModal = (job: Job) => {
  setEditingJob(job);
  
  // Helper to convert array to comma-separated string
  const convertToString = (value: string[] | string): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value || '';
  };

  setFormData({
    title: job.title,
    location: job.location,
    salary: job.salary,
    job_type: job.job_type,
    description: job.description,
    required_skills: convertToString(job.required_skills),
    required_experience: convertToString(job.required_experience),
    required_education: convertToString(job.required_education),
    deadline: job.deadline,
    status: job.status,
  });
  setShowEditModal(true);
  document.body.style.overflow = "hidden";
};

  const closeModals = () => {
    setShowPostModal(false);
    setShowEditModal(false);
    setEditingJob(null);
    document.body.style.overflow = "auto";
  };

  const handleCloseJob = async (jobId: string) => {
  try {
    setClosingJob(jobId);
    const response = await jobService.closeJob(jobId);
    if (response.success) {
      toast.success('Job closed successfully');
      await fetchJobs();
    }
  } catch (error: any) {
    toast.error(error.message || 'Failed to close job');
  } finally {
    setClosingJob(null);
  }
};

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmitJob = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation
  if (
    !formData.title ||
    !formData.location ||
    !formData.salary ||
    !formData.description ||
    !formData.deadline
  ) {
    toast.error("Please fill in all required fields");
    return;
  }

  try {
    setSubmitting(true);

    // Helper function to convert comma-separated string to array
    const convertToArray = (value: string): string[] => {
      if (!value) return [];
      return value.split(',').map(item => item.trim()).filter(item => item !== '');
    };

    // Prepare the data with proper types
    const jobData = {
      title: formData.title,
      location: formData.location,
      salary: formData.salary,
      job_type: formData.job_type as
        | "full_time"
        | "part_time"
        | "contract"
        | "internship"
        | "remote",
      description: formData.description,
      required_skills: convertToArray(formData.required_skills),
      required_experience: convertToArray(formData.required_experience),
      required_education: convertToArray(formData.required_education),
      deadline: formData.deadline,
      status: formData.status as "active" | "inactive" | "draft" | "closed",
    };

    if (editingJob) {
      // Update existing job
      const response = await jobService.updateJob(editingJob.job_id, jobData);
      if (response.success) {
        toast.success("Job updated successfully!");
        await fetchJobs();
        closeModals();
      }
    } else {
      // Create new job
      const response = await jobService.createJob(jobData);
      if (response.success) {
        toast.success("Job posted successfully!");
        await fetchJobs();
        closeModals();
      }
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to save job");
  } finally {
    setSubmitting(false);
  }
};

  const handlePublish = async (jobId: string) => {
    try {
      setSubmitting(true);
      const response = await jobService.publishJob(jobId);
      if (response.success) {
        toast.success("Job published successfully");
        await fetchJobs();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to publish job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedJob(null);
    document.body.style.overflow = "auto";
  };

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
    document.body.style.overflow = "auto";
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      try {
        const response = await jobService.deleteJob(jobToDelete);
        if (response.success) {
          toast.success("Job deleted successfully");
          await fetchJobs();
          closeDeleteModal();
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to delete job");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "closed":
        return "bg-red-100 text-red-700 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      case "draft":
        return <ClockIcon className="h-4 w-4" />;
      case "inactive":
        return <ClockIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getDisplayStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full_time":
        return "bg-blue-100 text-blue-700";
      case "part_time":
        return "bg-green-100 text-green-700";
      case "contract":
        return "bg-orange-100 text-orange-700";
      case "internship":
        return "bg-purple-100 text-purple-700";
      case "remote":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDisplayType = (type: string) => {
    return type.replace("_", " ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const getSkillsString = (skills: string[] | string) => {
  if (Array.isArray(skills)) {
    return skills.join(' ').toLowerCase();
  }
  return skills.toLowerCase();
};

const matchesSearch =
  job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  job.employer_profile.company_name
    .toLowerCase()
    .includes(searchQuery.toLowerCase()) ||
  job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
  getSkillsString(job.required_skills).includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderSkills = (skills: string[] | string) => {
  if (Array.isArray(skills)) {
    return skills.map((skill, index) => (
      <span
        key={index}
        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
      >
        {skill.trim()}
      </span>
    ));
  }
  return skills.split(",").map((skill, index) => (
    <span
      key={index}
      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
    >
      {skill.trim()}
    </span>
  ));
};

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const statusOptions = ["All", "active", "closed", "draft", "inactive"];

  // Stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const closedJobs = jobs.filter((j) => j.status === "closed").length;
  const draftJobs = jobs.filter((j) => j.status === "draft").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage all your job vacancies and track applications
          </p>
        </div>
        <button
          onClick={handleOpenPostModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Jobs</p>
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalJobs}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">Active</p>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">{activeJobs}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">Closed</p>
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700 mt-1">{closedJobs}</p>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">Draft</p>
            <ClockIcon className="h-5 w-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-700 mt-1">{draftJobs}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm font-medium"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All" : getDisplayStatus(status)}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredJobs.length}{" "}
        {filteredJobs.length === 1 ? "job" : "jobs"}
      </p>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your search or filter criteria"
              : "Start posting jobs to attract top talent"}
          </p>
        </div>
      ) : (
        <>
          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentJobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Building className="h-4 w-4 mr-1" />
                            {job.employer_profile.company_name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}
                    >
                      {getStatusIcon(job.status)}
                      <span>{getDisplayStatus(job.status)}</span>
                    </span>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Posted: {formatDate(job.posted_date)}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2">
                        {renderSkills(job.required_skills)}
                      </div>

                    {/* Job Type and Deadline */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.job_type)}`}
                      >
                        {getDisplayType(job.job_type)}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                        Deadline: {formatDate(job.deadline)}
                      </span>
                    </div>

                    {/* Action Buttons */}

                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                      {job.status === "draft" && (
                        <button
                          onClick={() => handlePublish(job.job_id)}
                          disabled={submitting}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                            submitting
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Publish</span>
                            </>
                          )}
                        </button>
                      )}

                       {job.status === "active" && (
                          <button
                            onClick={() => handleCloseJob(job.job_id)}
                            disabled={closingJob === job.job_id}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                              closingJob === job.job_id
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                            }`}
                          >
                            {closingJob === job.job_id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Closing...</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4" />
                                <span>Close</span>
                              </>
                            )}
                          </button>
                        )}

                      {job.status === "draft" && (
                        <>
                          <button
                            onClick={() => handleOpenEditModal(job)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center space-x-1.5"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center space-x-1.5"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleDeleteClick(job.job_id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center space-x-1.5"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredJobs.length > jobsPerPage && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstJob + 1}-
                {Math.min(indexOfLastJob, filteredJobs.length)} of{" "}
                {filteredJobs.length} jobs
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from(
                  { length: Math.min(totalPages, 3) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50 transition-colors"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 3 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Post/Edit Job Modal */}
      {(showPostModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingJob ? "Edit Job" : "Post New Job"}
                </h2>
              </div>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="e.g. Harare, Zimbabwe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleFormChange}
                    placeholder="e.g. $50,000 - $70,000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    required
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Describe the job role, responsibilities, and benefits..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <textarea
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="List the required skills"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Experience
                </label>
                <textarea
                  name="required_experience"
                  value={formData.required_experience}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Describe the required experience"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Education
                </label>
                <textarea
                  name="required_education"
                  value={formData.required_education}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Describe the required education"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>

                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModals}
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
                      <span>{editingJob ? "Updating..." : "Posting..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{editingJob ? "Update Job" : "Post Job"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedJob.title}
                  </h2>
                  <p className="text-gray-600">
                    {selectedJob.employer_profile.company_name}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetailsModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{selectedJob.location}</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{selectedJob.salary}</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Job Type</p>
                  <p className="font-medium text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getTypeColor(selectedJob.job_type)}`}
                    >
                      {getDisplayType(selectedJob.job_type)}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedJob.status)}`}
                    >
                      {getStatusIcon(selectedJob.status)}
                      <span>{getDisplayStatus(selectedJob.status)}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed break-words">
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wrench className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900">
                      Required Skills
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                   {selectedJob.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium break-words"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900">Experience</h4>
                  </div>
                  <p className="text-gray-700 text-sm break-words">
                    {selectedJob.required_experience}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900">Education</h4>
                  </div>
                  <p className="text-gray-700 text-sm break-words">
                    {selectedJob.required_education}
                  </p>
                </div>
              </div>

              {/* Company Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About the Company
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Building className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium break-words">
                        {selectedJob.employer_profile.company_name}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm break-words">
                      {selectedJob.employer_profile.company_description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <a
                        href={selectedJob.employer_profile.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-words"
                      >
                        {selectedJob.employer_profile.company_website}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-words">
                        {selectedJob.employer_profile.user.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-words">
                        {selectedJob.employer_profile.user.phone_number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posted and Deadline */}
              <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">Posted Date:</span>
                  <span className="ml-2 break-words">
                    {formatDate(selectedJob.posted_date)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">Application Deadline:</span>
                  <span className="ml-2 break-words">
                    {formatDate(selectedJob.deadline)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
                {selectedJob.status === "draft" && (
                  <button
                    onClick={() => {
                      handlePublish(selectedJob.job_id);
                      closeDetailsModal();
                    }}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Publish Job
                  </button>
                )}
                <button
                  onClick={() => {
                    closeDetailsModal();
                    navigate(`/employer/edit-job/${selectedJob.job_id}`);
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <Trash2 className="h-8 w-8" />
                <h2 className="text-xl font-bold">Delete Job</h2>
              </div>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this job posting?
              </p>
              <p className="text-gray-500 text-sm mb-6">
                This action cannot be undone and all associated applications
                will be removed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Job</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerJobPostings;

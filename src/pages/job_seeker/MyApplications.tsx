// pages/dashboard/components/MyApplications.tsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  X,
  Building,
  Mail,
  Phone,
  Globe,
  Award,
  GraduationCap,
  Wrench,
  FileText,
  User,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import applicationService from "../../services/applications_service";
import { toast } from "react-hot-toast";

interface Application {
  application_id: string;
  job: {
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
    job_type: "full_time" | "part_time" | "contract" | "internship" | "remote";
    description: string;
    required_skills: string[];
    required_experience: string[];
    required_education: string[];
    deadline: string;
    status: string;
    posted_date: string;
    updated_at: string;
  };
  applicant: {
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
  };
  status:
    | "submitted"
    | "reviewed"
    | "shortlisted"
    | "interviewed"
    | "offered"
    | "rejected";
  skills_score: string;
  experience_score: string;
  education_score: string;
  total_match_score: string;
  applied_date: string;
  updated_at: string;
}

const MyApplications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const applicationsPerPage = 8;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getJobSeekerApplications();
      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        toast.error("Failed to load applications");
      }
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      toast.error(error.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    document.body.style.overflow = "auto";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <ClockIcon className="h-4 w-4" />;
      case "reviewed":
        return <ClockIcon className="h-4 w-4" />;
      case "shortlisted":
        return <Calendar className="h-4 w-4" />;
      case "interviewed":
        return <Calendar className="h-4 w-4" />;
      case "offered":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "reviewed":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "shortlisted":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "interviewed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "offered":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "submitted":
        return "Applied";
      case "reviewed":
        return "Under Review";
      case "shortlisted":
        return "Shortlisted";
      case "interviewed":
        return "Interview";
      case "offered":
        return "Offered";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusCount = (status: string) => {
    if (status === "All") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case "submitted":
        return "w-1/4";
      case "reviewed":
        return "w-1/2";
      case "shortlisted":
        return "w-2/3";
      case "interviewed":
        return "w-3/4";
      case "offered":
        return "w-full";
      case "rejected":
        return "w-full";
      default:
        return "w-0";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500";
      case "reviewed":
        return "bg-yellow-500";
      case "shortlisted":
        return "bg-purple-500";
      case "interviewed":
        return "bg-indigo-500";
      case "offered":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressLabel = (status: string) => {
    switch (status) {
      case "submitted":
        return "Application Submitted";
      case "reviewed":
        return "Under Review";
      case "shortlisted":
        return "Shortlisted";
      case "interviewed":
        return "Interview Stage";
      case "offered":
        return "Offer Received 🎉";
      case "rejected":
        return "Application Closed";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusOptions = [
    "All",
    "submitted",
    "reviewed",
    "shortlisted",
    "interviewed",
    "offered",
    "rejected",
  ];

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.employer_profile.company_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastApp = currentPage * applicationsPerPage;
  const indexOfFirstApp = indexOfLastApp - applicationsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirstApp,
    indexOfLastApp,
  );
  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage,
  );

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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
        <p className="text-gray-500 text-sm mt-1">
          Track and manage all your job applications in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">
            {applications.length}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-sm text-green-700">Offers Received</p>
          <p className="text-2xl font-bold text-green-700">
            {applications.filter((app) => app.status === "offered").length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 shadow-sm">
          <p className="text-sm text-yellow-700">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">
            {
              applications.filter(
                (app) =>
                  app.status === "reviewed" ||
                  app.status === "shortlisted" ||
                  app.status === "interviewed",
              ).length
            }
          </p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 shadow-sm">
          <p className="text-sm text-red-700">Rejected</p>
          <p className="text-2xl font-bold text-red-700">
            {applications.filter((app) => app.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications by job title, company, or location..."
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
                  {status === "All" ? "All" : getDisplayStatus(status)} (
                  {getStatusCount(status)})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredApplications.length}{" "}
        {filteredApplications.length === 1 ? "application" : "applications"}
      </p>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-500 text-sm">
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your search or filter criteria"
              : "Start applying to jobs to track your applications here"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentApplications.map((application) => (
              <div
                key={application.application_id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left Section - Company and Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                          {application.job.employer_profile.company_logo_url ? (
                            <img
                              src={
                                application.job.employer_profile
                                  .company_logo_url
                              }
                              alt={
                                application.job.employer_profile.company_name
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                              {application.job.employer_profile.company_name.charAt(
                                0,
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                                {application.job.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {application.job.employer_profile.company_name}
                              </p>
                            </div>
                          </div>

                          {/* Job Details */}
                          <div className="flex flex-wrap gap-3 mt-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              {application.job.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {application.job.job_type.replace("_", " ")}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Applied: {formatDate(application.applied_date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Status and Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      <div
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(application.status)}`}
                      >
                        {getStatusIcon(application.status)}
                        <span>{getDisplayStatus(application.status)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(application)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <ExternalLink className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Application Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>Application Progress</span>
                      <span>{getProgressLabel(application.status)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${getProgressWidth(application.status)} ${getProgressColor(application.status)}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredApplications.length > applicationsPerPage && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstApp + 1}-
                {Math.min(indexOfLastApp, filteredApplications.length)} of{" "}
                {filteredApplications.length} applications
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

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center space-x-4">
                {selectedApplication.job.employer_profile.company_logo_url ? (
                  <img
                    src={
                      selectedApplication.job.employer_profile.company_logo_url
                    }
                    alt={selectedApplication.job.employer_profile.company_name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
                    {selectedApplication.job.employer_profile.company_name.charAt(
                      0,
                    )}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedApplication.job.title}
                  </h2>
                  <p className="text-gray-600">
                    {selectedApplication.job.employer_profile.company_name}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Match Score */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      Match Score
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedApplication.total_match_score}%
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Skills</p>
                    <p className="font-medium text-gray-900">
                      {selectedApplication.skills_score}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">
                      {selectedApplication.experience_score}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Education</p>
                    <p className="font-medium text-gray-900">
                      {selectedApplication.education_score}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {selectedApplication.job.location}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {selectedApplication.job.salary}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Job Type</p>
                  <p className="font-medium text-gray-900">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      {selectedApplication.job.job_type.replace("_", " ")}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedApplication.status)}`}
                    >
                      {getDisplayStatus(selectedApplication.status)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Job Description
                </h3>
                <p className="text-gray-700 leading-relaxed break-words">
                  {selectedApplication.job.description}
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
                    {selectedApplication.job.required_skills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg font-medium break-words"
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900">Experience</h4>
                  </div>
                  <p className="text-gray-700 text-sm break-words">
                    {Array.isArray(selectedApplication.job.required_experience)
                      ? selectedApplication.job.required_experience.join(", ")
                      : selectedApplication.job.required_experience}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <h4 className="font-semibold text-gray-900">Education</h4>
                  </div>
                  <p className="text-gray-700 text-sm break-words">
                    {Array.isArray(selectedApplication.job.required_education)
                      ? selectedApplication.job.required_education.join(", ")
                      : selectedApplication.job.required_education}
                  </p>
                </div>
              </div>

              {/* Applicant Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Application
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <User className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">
                        {selectedApplication.applicant.user.first_name}{" "}
                        {selectedApplication.applicant.user.last_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-words">
                        {selectedApplication.applicant.user.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-words">
                        {selectedApplication.applicant.user.phone_number}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <a
                        href={selectedApplication.applicant.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-words"
                      >
                        View Resume
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">
                        Applied: {formatDate(selectedApplication.applied_date)}
                      </span>
                    </div>
                  </div>
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
                        {selectedApplication.job.employer_profile.company_name}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm break-words">
                      {
                        selectedApplication.job.employer_profile
                          .company_description
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <a
                        href={
                          selectedApplication.job.employer_profile
                            .company_website
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-words"
                      >
                        {
                          selectedApplication.job.employer_profile
                            .company_website
                        }
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-words">
                        {selectedApplication.job.employer_profile.user.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm break-words">
                        {
                          selectedApplication.job.employer_profile.user
                            .phone_number
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">Application Deadline:</span>
                  <span className="ml-2 break-words">
                    {formatDate(selectedApplication.job.deadline)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;

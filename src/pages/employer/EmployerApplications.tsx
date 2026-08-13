// pages/dashboard/employer/components/EmployerApplications.tsx
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Mail,
  Phone,
  Download,
  UserCheck,
  MoreVertical,
  Edit3,
  FileDown,
  Loader2,
  X,
} from "lucide-react";
import applicationService from "../../services/applications_service";
import { toast } from "react-hot-toast";

interface Application {
  application_id: string;
  job: {
    job_id: string;
    title: string;
    location: string;
    salary: string;
    job_type: string;
    description: string;
    required_skills: string;
    required_experience: string;
    required_education: string;
    deadline: string;
    status: string;
    posted_date: string;
    updated_at: string;
    employer_profile: {
      profile_id: string;
      company_name: string;
      company_website: string;
      location: string;
      company_description: string;
      company_logo_url: string;
      user: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        role: string;
        registration_date: string;
      };
      created_at: string;
      updated_at: string;
    };
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
    | "under_review"
    | "shortlisted"
    | "interviewed"
    | "hired"
    | "rejected";
  skills_score: string;
  experience_score: string;
  education_score: string;
  total_match_score: string;
  applied_date: string;
  updated_at: string;
}

const EmployerApplications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobFilter, setJobFilter] = useState("All");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const applicationsPerPage = 6;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplications();
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
    setShowDetailsModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedApplication(null);
    document.body.style.overflow = "auto";
  };

  const handleOpenStatusModal = (application: Application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setShowStatusModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedApplication(null);
    setNewStatus("");
    document.body.style.overflow = "auto";
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;

    try {
      setUpdatingStatus(true);
      const response = await applicationService.updateStatus(
        selectedApplication.application_id,
        {
          status: newStatus as any,
        },
      );

      if (response.success) {
        toast.success("Application status updated successfully");
        await fetchApplications();
        closeStatusModal();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const viewResume = (resumeUrl: string) => {
    if (resumeUrl) {
      window.open(resumeUrl, "_blank");
    } else {
      toast.error("No resume available");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "under_review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "shortlisted":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "interviewed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "hired":
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
      case "under_review":
        return "Under Review";
      case "shortlisted":
        return "Shortlisted";
      case "interviewed":
        return "Interview";
      case "hired":
        return "Hired";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <ClockIcon className="h-4 w-4" />;
      case "under_review":
        return <ClockIcon className="h-4 w-4" />;
      case "shortlisted":
        return <UserCheck className="h-4 w-4" />;
      case "interviewed":
        return <Calendar className="h-4 w-4" />;
      case "hired":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const jobOptions = [
    "All",
    ...new Set(applications.map((app) => app.job.title)),
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicant.user.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.applicant.user.last_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.employer_profile.company_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.applicant.user.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesJob = jobFilter === "All" || app.job.title === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
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

  const getStatusCount = (status: string) => {
    if (status === "All") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  const statusOptions = [
    "All",
    "submitted",
    "under_review",
    "shortlisted",
    "interviewed",
    "hired",
    "rejected",
  ];

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
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <p className="text-gray-500 text-sm mt-1">
            Review and manage all candidate applications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Applications</p>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {applications.length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-purple-700">Under Review</p>
            <ClockIcon className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {
              applications.filter(
                (app) =>
                  app.status === "under_review",
              ).length
            }
          </p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">Shortlisted</p>
            <UserCheck className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {
              applications.filter(
                (app) =>
                  app.status === "shortlisted",
              ).length
            }
          </p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">Rejected</p>
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700 mt-1">
            {applications.filter((app) => app.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by candidate name, job title, or company..."
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
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm font-medium"
            >
              <option value="All">All Jobs</option>
              {jobOptions
                .filter((j) => j !== "All")
                .map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
            </select>
            <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredApplications.length}{" "}
        {filteredApplications.length === 1 ? "application" : "applications"}
      </p>

      {/* Applications Cards Grid */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchQuery || statusFilter !== "All" || jobFilter !== "All"
              ? "Try adjusting your search or filter criteria"
              : "Start receiving applications by posting job openings"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentApplications.map((application) => (
              <div
                key={application.application_id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[320px]"
              >
                <div className="p-6">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {getInitials(
                          application.applicant.user.first_name,
                          application.applicant.user.last_name,
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {application.applicant.user.first_name}{" "}
                          {application.applicant.user.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {application.job.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Match Score */}
                      <div
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getScoreColor(parseFloat(application.total_match_score))}`}
                      >
                        <span>
                          {Math.round(
                            parseFloat(application.total_match_score),
                          )}
                          %
                        </span>
                        <span className="text-xs">Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Details */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-1" />
                        {application.applicant.user.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-1" />
                        {application.applicant.user.phone_number}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {application.job.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {application.applicant.experience?.[0]?.role || "N/A"}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied: {formatDate(application.applied_date)}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Education:</span>{" "}
                      {application.applicant.education?.[0]?.institution ||
                        "N/A"}
                    </div>

                    {/* Skills Tags - Only show first 3 skills with ... */}
                    <div className="flex flex-wrap gap-2">
                      {application.applicant.skills &&
                      application.applicant.skills.length > 0 ? (
                        <>
                          {application.applicant.skills
                            .slice(0, 3)
                            .map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          {application.applicant.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg font-medium">
                              +{application.applicant.skills.length - 3} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No skills listed
                        </span>
                      )}
                    </div>

                    {/* Status and Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 gap-3">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}
                        >
                          {getStatusIcon(application.status)}
                          <span>{getDisplayStatus(application.status)}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {/* View Button */}
                        <button
                          onClick={() => handleViewDetails(application)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Application"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {/* Update Status Button */}
                        <button
                          onClick={() => handleOpenStatusModal(application)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Update Status"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {/* Download Resume Button */}
                        <button
                          onClick={() =>
                            viewResume(application.applicant.resume_url)
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View Resume"
                        >
                          <FileDown className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
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

      {/* View Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {getInitials(
                    selectedApplication.applicant.user.first_name,
                    selectedApplication.applicant.user.last_name,
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedApplication.applicant.user.first_name}{" "}
                    {selectedApplication.applicant.user.last_name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedApplication.job.title} at{" "}
                    {selectedApplication.job.employer_profile.company_name}
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
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication.status)}`}
                  >
                    {getStatusIcon(selectedApplication.status)}
                    <span>{getDisplayStatus(selectedApplication.status)}</span>
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Match Score</p>
                  <p
                    className={`font-bold text-lg ${parseFloat(selectedApplication.total_match_score) >= 80 ? "text-green-600" : parseFloat(selectedApplication.total_match_score) >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {Math.round(
                      parseFloat(selectedApplication.total_match_score),
                    )}
                    %
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Applied Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedApplication.applied_date)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Job Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {selectedApplication.job.job_type.replace("_", " ")}
                  </p>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedApplication.applicant.user.email}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedApplication.applicant.user.phone_number}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {selectedApplication.job.location}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Job Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Position:</span>{" "}
                      {selectedApplication.job.title}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Company:</span>{" "}
                      {selectedApplication.job.employer_profile.company_name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Salary:</span>{" "}
                      {selectedApplication.job.salary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Match Scores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Skills Score</p>
                    <p className="text-lg font-bold text-blue-600">
                      {Math.round(parseFloat(selectedApplication.skills_score))}
                      %
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Experience Score</p>
                    <p className="text-lg font-bold text-purple-600">
                      {Math.round(
                        parseFloat(selectedApplication.experience_score),
                      )}
                      %
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Education Score</p>
                    <p className="text-lg font-bold text-green-600">
                      {Math.round(
                        parseFloat(selectedApplication.education_score),
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.applicant.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume */}
              <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeDetailsModal();
                    handleOpenStatusModal(selectedApplication);
                  }}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Update Status</span>
                </button>
                <button
                  onClick={() =>
                    viewResume(selectedApplication.applicant.resume_url)
                  }
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <FileDown className="h-4 w-4" />
                  <span>View Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Edit3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Update Status
                  </h2>
                </div>
                <button
                  onClick={closeStatusModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Candidate</p>
                  <p className="font-medium text-gray-900">
                    {selectedApplication.applicant.user.first_name}{" "}
                    {selectedApplication.applicant.user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication.status)}`}
                  >
                    {getStatusIcon(selectedApplication.status)}
                    <span>{getDisplayStatus(selectedApplication.status)}</span>
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="submitted">Applied</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeStatusModal}
                    disabled={updatingStatus}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={
                      updatingStatus || newStatus === selectedApplication.status
                    }
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    {updatingStatus ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-5 w-5" />
                        <span>Update Status</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;

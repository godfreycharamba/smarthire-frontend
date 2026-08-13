import React, { useState, useEffect } from 'react';
import {
  Search,
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
  Download,
  UserCheck,
  Award,
  TrendingUp,
  Medal,
  Crown,
  FileDown,
  
  Loader2,
  MapPin,
  Phone,
  X
} from 'lucide-react';
import jobService from '../../services/JobService';
import applicationService from '../../services/applications_service';
import { toast } from 'react-hot-toast';

interface Job {
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
}

interface Application {
  application_id: string;
  job: Job;
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
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  skills_score: string;
  experience_score: string;
  education_score: string;
  total_match_score: string;
  applied_date: string;
  updated_at: string;
}

const RankedCandidates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 8;

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplicationsByJob(selectedJobId);
    }
  }, [selectedJobId]);

 const fetchJobs = async () => {
  try {
    setLoading(true);
    const response = await jobService.getEmployerJobs();
    if (response.success && response.data) {
      
      const allJobs = response.data;
      setJobs(allJobs);
      if (allJobs.length > 0) {
        setSelectedJobId(allJobs[0].job_id);
      }
    } else {
      toast.error('Failed to load jobs');
    }
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    toast.error(error.message || 'Failed to load jobs');
  } finally {
    setLoading(false);
  }
};

  const fetchApplicationsByJob = async (jobId: string) => {
    try {
      setLoadingApplications(true);
      const response = await applicationService.getApplicationsByJob(jobId);
      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        setApplications([]);
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error(error.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleViewProfile = (application: Application) => {
  setSelectedApplication(application);
  setShowProfileModal(true);
  document.body.style.overflow = 'hidden';
};

const closeProfileModal = () => {
  setShowProfileModal(false);
  setSelectedApplication(null);
  document.body.style.overflow = 'auto';
};

    const viewResume = (resumeUrl: string) => {
      if (resumeUrl) {
        window.open(resumeUrl, "_blank");
      } else {
        toast.error("No resume available");
      }
    };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under_review': return 'bg-yellow-100 text-yellow-700';
      case 'shortlisted': return 'bg-indigo-100 text-indigo-700';
      case 'interviewed': return 'bg-purple-100 text-purple-700';
      case 'hired': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDisplayStatus = (status: string) => {
    switch(status) {
      case 'submitted': return 'Applied';
      case 'under_review': return 'Under Review';
      case 'shortlisted': return 'Shortlisted';
      case 'interviewed': return 'Interview';
      case 'hired': return 'Hired';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'submitted': return <ClockIcon className="h-3 w-3" />;
      case 'under_review': return <ClockIcon className="h-3 w-3" />;
      case 'shortlisted': return <UserCheck className="h-3 w-3" />;
      case 'interviewed': return <Calendar className="h-3 w-3" />;
      case 'hired': return <CheckCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400 fill-current" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-semibold text-gray-400">#{rank}</span>;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

   const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

// Sort applications by match score and add rank
 const rankedApplications = applications.map((app, index) => ({
  ...app,
  rank: index + 1
}));

  const statusOptions = ['All', 'submitted', 'under_review', 'shortlisted', 'interviewed', 'hired', 'rejected'];

  const filteredApplications = rankedApplications.filter(app => {
    const candidateName = `${app.applicant.user.first_name} ${app.applicant.user.last_name}`.toLowerCase();
    const matchesSearch = candidateName.includes(searchQuery.toLowerCase()) ||
                          app.applicant.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.applicant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(filteredApplications.length / candidatesPerPage);

  const selectedJob = jobs.find(j => j.job_id === selectedJobId);

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
          <h2 className="text-2xl font-bold text-gray-900">Ranked Candidates</h2>
          <p className="text-gray-500 text-sm mt-1">
            AI-ranked candidates for each job posting
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Job Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Select Job:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {jobs.map((job) => (
              <button
                key={job.job_id}
                onClick={() => setSelectedJobId(job.job_id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedJobId === job.job_id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {job.title}
                <span className={`ml-2 text-xs ${
                  selectedJobId === job.job_id ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  ({applications.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Candidates</p>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{rankedApplications.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">Top Matches (80%+)</p>
            <Award className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {rankedApplications.filter(app => parseFloat(app.total_match_score) >= 80).length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-purple-700">Interview Stage</p>
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {rankedApplications.filter(app => app.status === 'interviewed').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">Avg. Match Score</p>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {rankedApplications.length > 0 
              ? Math.round(rankedApplications.reduce((sum, app) => sum + parseFloat(app.total_match_score), 0) / rankedApplications.length)
              : 0}%
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates by name, surname, email or skills..."
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
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All' : getDisplayStatus(status)}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredApplications.length} {filteredApplications.length === 1 ? 'candidate' : 'candidates'}
        {selectedJob && ` for ${selectedJob.title}`}
      </p>

      {loadingApplications ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchQuery || statusFilter !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Start receiving applications to see ranked candidates here'}
          </p>
        </div>
      ) : (
        <>
          {/* Ranked Candidates Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate Name</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Surname</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Match Score</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentApplications.map((app, index) => (
                    <tr key={app.application_id} className={`hover:bg-gray-50 transition-colors ${
                      index < 3 ? 'bg-blue-50/20' : ''
                    }`}>
                      {/* Rank */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRankIcon(index + 1)}
                        </div>
                      </td>
                      
                      {/* Candidate Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {getInitials(app.applicant.user.first_name, app.applicant.user.last_name)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{app.applicant.user.first_name}</span>
                        </div>
                      </td>
                      
                      {/* Surname */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{app.applicant.user.last_name}</span>
                      </td>
                      
                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                          {app.applicant.user.email}
                        </div>
                      </td>
                      
                      {/* Match Score */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(parseFloat(app.total_match_score))}`}>
                            {Math.round(parseFloat(app.total_match_score))}%
                          </div>
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          <span>{getDisplayStatus(app.status)}</span>
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewProfile(app)} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="View Resume"
                           onClick={() =>
                            viewResume(app.applicant.resume_url)
                          }
                          >
                            <FileDown className="h-4 w-4" />
                          </button>
                         
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {filteredApplications.length > candidatesPerPage && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstCandidate + 1}-{Math.min(indexOfLastCandidate, filteredApplications.length)} of {filteredApplications.length} candidates
              </p>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50 transition-colors'
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

      {/* View Profile Modal */}
{showProfileModal && selectedApplication && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {getInitials(selectedApplication.applicant.user.first_name, selectedApplication.applicant.user.last_name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedApplication.applicant.user.first_name} {selectedApplication.applicant.user.last_name}
            </h2>
            <p className="text-gray-600">{selectedApplication.applicant.title || 'Job Seeker'}</p>
          </div>
        </div>
        <button
          onClick={closeProfileModal}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
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
            <h3 className="text-sm font-medium text-gray-500 mb-3">Job Details</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Applied for:</span> {selectedApplication.job.title}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Company:</span> {selectedApplication.job.employer_profile.company_name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Applied Date:</span> {formatDate(selectedApplication.applied_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Match Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Total Match</p>
              <p className={`text-lg font-bold ${parseFloat(selectedApplication.total_match_score) >= 80 ? 'text-green-600' : parseFloat(selectedApplication.total_match_score) >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {Math.round(parseFloat(selectedApplication.total_match_score))}%
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Skills</p>
              <p className="text-lg font-bold text-blue-600">{Math.round(parseFloat(selectedApplication.skills_score))}%</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Experience</p>
              <p className="text-lg font-bold text-purple-600">{Math.round(parseFloat(selectedApplication.experience_score))}%</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Education</p>
              <p className="text-lg font-bold text-green-600">{Math.round(parseFloat(selectedApplication.education_score))}%</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">
            {selectedApplication.applicant.bio || 'No bio provided.'}
          </p>
        </div>

        {/* Skills */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {selectedApplication.applicant.skills?.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
          {selectedApplication.applicant.experience && selectedApplication.applicant.experience.length > 0 ? (
            selectedApplication.applicant.experience.map((exp: any, index: number) => (
              <div key={index} className="mb-3 last:mb-0 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{exp.role || exp.position}</p>
                <p className="text-sm text-gray-600">{exp.organization || exp.company}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
                {exp.responsibilities && Array.isArray(exp.responsibilities) && (
                  <ul className="mt-2 space-y-1">
                    {exp.responsibilities.slice(0, 2).map((resp: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600 list-disc list-inside">• {resp}</li>
                    ))}
                    {exp.responsibilities.length > 2 && (
                      <li className="text-sm text-gray-400">+{exp.responsibilities.length - 2} more responsibilities</li>
                    )}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No experience listed</p>
          )}
        </div>

        {/* Education */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Education</h3>
          {selectedApplication.applicant.education && selectedApplication.applicant.education.length > 0 ? (
            selectedApplication.applicant.education.map((edu: any, index: number) => (
              <div key={index} className="mb-2 last:mb-0 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{edu.qualification || edu.course || edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.status || ''}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No education listed</p>
          )}
        </div>

        {/* Resume */}
        <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
          <button
            onClick={closeProfileModal}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (selectedApplication.applicant.resume_url) {
                window.open(selectedApplication.applicant.resume_url, '_blank');
              } else {
                toast.error('No resume available');
              }
            }}
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
    </div>
  );
};

export default RankedCandidates;
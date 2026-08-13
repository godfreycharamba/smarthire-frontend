// pages/dashboard/components/JobPostings.tsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
   X,
  Building,
  Mail,
  Phone,
  Globe,
  Award,
  GraduationCap,
  Wrench,
  Calendar
} from 'lucide-react';
import jobService , {type Job} from '../../services/JobService';
import applicationService from '../../services/applications_service';
import { toast } from 'react-hot-toast';


const JobPostings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
const [showModal, setShowModal] = useState(false);
const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const jobsPerPage = 6;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobs();
      if (response.success && response.data) {
        setJobs(response.data);
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

  const handleViewDetails = (job: Job) => {
  setSelectedJob(job);
  setShowModal(true);
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  setShowModal(false);
  setSelectedJob(null);
  document.body.style.overflow = 'auto';
};

const handleApply = async (jobId: string) => {
  try {
    setApplyingJobId(jobId);
    const response = await applicationService.createApplication({
      job_id: jobId,
      status: 'submitted'
    });
    
    if (response.success) {
      toast.success('Application submitted successfully!');
    } else {
      toast.error(response.message || 'Failed to submit application');
    }
  } catch (error: any) {
    console.error('Error applying for job:', error);
    toast.error(error.message || 'Failed to submit application');
  } finally {
    setApplyingJobId(null);
  }
};


  const getSkillsString = (skills: string[] | string): string => {
  if (Array.isArray(skills)) {
    return skills.join(' ').toLowerCase();
  }
  return skills.toLowerCase();
};

 const filteredJobs = jobs
  .filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer_profile.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getSkillsString(job.required_skills).includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || job.job_type === filterType;
    
    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
      case 'oldest':
        return new Date(a.posted_date).getTime() - new Date(b.posted_date).getTime();
      case 'salary':
        return a.salary.localeCompare(b.salary);
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'full_time': return 'bg-green-100 text-green-700';
      case 'part_time': return 'bg-blue-100 text-blue-700';
      case 'contract': return 'bg-orange-100 text-orange-700';
      case 'internship': return 'bg-purple-100 text-purple-700';
      case 'remote': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
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

  return (
    <div className="space-y-6">
      {/* Job Postings Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
          <p className="text-gray-500 text-sm mt-1">
            Find your dream job from {jobs.length} available positions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Types</option>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="salary">Highest Salary</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs by title, company, location, or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        />
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
      </p>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {currentJobs.map((job) => (
              <div key={job.job_id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  {/* Company Logo and Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                        {job.employer_profile.company_logo_url ? (
                          <img 
                            src={job.employer_profile.company_logo_url} 
                            alt={job.employer_profile.company_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                            {job.employer_profile.company_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{job.employer_profile.company_name}</p>
                      </div>
                    </div>
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
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(job.posted_date)}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {job.description}
                    </p>

                    {/* Skills Tags */}
                   
                    <div className="flex flex-wrap gap-2">
                     {job.required_skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                              {skill.trim()}
                            </span>
                          ))}
                          {job.required_skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg font-medium">
                              +{job.required_skills.length - 3} more
                            </span>
                          )}
                    </div>

                    {/* Job Type Badge and Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.job_type)}`}>
                        {job.job_type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => handleApply(job.job_id)}
                            disabled={applyingJobId === job.job_id}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                              applyingJobId === job.job_id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            {applyingJobId === job.job_id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Please wait...</span>
                              </>
                            ) : (
                              <span>Quick Apply</span>
                            )}
                          </button>
                       <button 
                          onClick={() => handleViewDetails(job)}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
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
                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
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

      {/* Job Details Modal */}
{showModal && selectedJob && (
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
          {selectedJob.employer_profile.company_logo_url ? (
            <img
              src={selectedJob.employer_profile.company_logo_url}
              alt={selectedJob.employer_profile.company_name}
              className="w-16 h-16 rounded-xl object-cover border border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-2xl">
              {selectedJob.employer_profile.company_name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
            <p className="text-gray-600">{selectedJob.employer_profile.company_name}</p>
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
              <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(selectedJob.job_type)}`}>
                {selectedJob.job_type.replace('_', ' ')}
              </span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Status</p>
            <p className="font-medium text-gray-900">
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                {selectedJob.status}
              </span>
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
          <p className="text-gray-700 leading-relaxed break-words">{selectedJob.description}</p>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wrench className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <h4 className="font-semibold text-gray-900">Required Skills</h4>
            </div>
            <div className="flex flex-wrap gap-1">
               {selectedJob.required_skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
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
            <p className="text-gray-700 text-sm break-words">{selectedJob.required_experience}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <GraduationCap className="h-5 w-5 text-green-600 flex-shrink-0" />
              <h4 className="font-semibold text-gray-900">Education</h4>
            </div>
            <p className="text-gray-700 text-sm break-words">{selectedJob.required_education}</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <Building className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium break-words">{selectedJob.employer_profile.company_name}</span>
              </div>
              <p className="text-gray-700 text-sm break-words">{selectedJob.employer_profile.company_description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <a href={selectedJob.employer_profile.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-words">
                  {selectedJob.employer_profile.company_website}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm break-words">{selectedJob.employer_profile.user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm break-words">{selectedJob.employer_profile.user.phone_number}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="font-medium">Application Deadline:</span>
            <span className="ml-2 break-words">{formatDate(selectedJob.deadline)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default JobPostings;
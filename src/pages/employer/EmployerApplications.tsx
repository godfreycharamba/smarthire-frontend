// pages/dashboard/employer/components/EmployerApplications.tsx
import React, { useState } from 'react';
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
  FileDown
} from 'lucide-react';

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  location: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Shortlisted' | 'Rejected' | 'Hired';
  matchScore: number;
  resume: string;
  experience: string;
  education: string;
  skills: string[];
}

const EmployerApplications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');

  const [applications] = useState<Application[]>([
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      company: 'Google',
      candidateName: 'Sarah Johnson',
      candidateEmail: 'sarah.j@email.com',
      candidatePhone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      appliedDate: '2024-01-15',
      status: 'Interview',
      matchScore: 94,
      resume: 'Sarah_Johnson_Resume.pdf',
      experience: '8 years',
      education: 'M.S. Computer Science, Stanford University',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript']
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'Microsoft',
      candidateName: 'Michael Chen',
      candidateEmail: 'michael.c@email.com',
      candidatePhone: '+1 (555) 234-5678',
      location: 'Seattle, WA',
      appliedDate: '2024-01-14',
      status: 'Under Review',
      matchScore: 87,
      resume: 'Michael_Chen_Resume.pdf',
      experience: '6 years',
      education: 'MBA, Harvard Business School',
      skills: ['Product Strategy', 'Agile', 'Azure', 'Leadership']
    },
    {
      id: 3,
      jobTitle: 'UX/UI Designer',
      company: 'Figma',
      candidateName: 'Emily Rodriguez',
      candidateEmail: 'emily.r@email.com',
      candidatePhone: '+1 (555) 345-6789',
      location: 'New York, NY',
      appliedDate: '2024-01-13',
      status: 'Shortlisted',
      matchScore: 82,
      resume: 'Emily_Rodriguez_Resume.pdf',
      experience: '5 years',
      education: 'BFA in Design, RISD',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping']
    },
    {
      id: 4,
      jobTitle: 'Data Scientist',
      company: 'Netflix',
      candidateName: 'James Wilson',
      candidateEmail: 'james.w@email.com',
      candidatePhone: '+1 (555) 456-7890',
      location: 'Los Angeles, CA',
      appliedDate: '2024-01-12',
      status: 'Applied',
      matchScore: 76,
      resume: 'James_Wilson_Resume.pdf',
      experience: '4 years',
      education: 'Ph.D. Statistics, UC Berkeley',
      skills: ['Python', 'ML', 'SQL', 'Statistics']
    },
    {
      id: 5,
      jobTitle: 'DevOps Engineer',
      company: 'Amazon',
      candidateName: 'Amanda Lee',
      candidateEmail: 'amanda.l@email.com',
      candidatePhone: '+1 (555) 567-8901',
      location: 'Portland, OR',
      appliedDate: '2024-01-11',
      status: 'Rejected',
      matchScore: 45,
      resume: 'Amanda_Lee_Resume.pdf',
      experience: '3 years',
      education: 'B.S. Computer Engineering, UT Austin',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
    },
    {
      id: 6,
      jobTitle: 'Frontend Developer',
      company: 'Stripe',
      candidateName: 'David Park',
      candidateEmail: 'david.p@email.com',
      candidatePhone: '+1 (555) 678-9012',
      location: 'Remote',
      appliedDate: '2024-01-10',
      status: 'Hired',
      matchScore: 91,
      resume: 'David_Park_Resume.pdf',
      experience: '7 years',
      education: 'M.S. Computer Science, MIT',
      skills: ['React', 'TypeScript', 'CSS', 'Next.js']
    },
    {
      id: 7,
      jobTitle: 'Senior Software Engineer',
      company: 'Google',
      candidateName: 'Priya Patel',
      candidateEmail: 'priya.p@email.com',
      candidatePhone: '+1 (555) 789-0123',
      location: 'Austin, TX',
      appliedDate: '2024-01-09',
      status: 'Under Review',
      matchScore: 79,
      resume: 'Priya_Patel_Resume.pdf',
      experience: '5 years',
      education: 'M.S. Software Engineering, CMU',
      skills: ['React', 'Java', 'Spring Boot', 'MongoDB']
    },
    {
      id: 8,
      jobTitle: 'Product Manager',
      company: 'Microsoft',
      candidateName: 'Ryan Thompson',
      candidateEmail: 'ryan.t@email.com',
      candidatePhone: '+1 (555) 890-1234',
      location: 'Chicago, IL',
      appliedDate: '2024-01-08',
      status: 'Interview',
      matchScore: 85,
      resume: 'Ryan_Thompson_Resume.pdf',
      experience: '6 years',
      education: 'MBA, Chicago Booth',
      skills: ['Product Strategy', 'Analytics', 'User Research']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Interview': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Shortlisted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Hired': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Applied': return <ClockIcon className="h-4 w-4" />;
      case 'Under Review': return <ClockIcon className="h-4 w-4" />;
      case 'Interview': return <Calendar className="h-4 w-4" />;
      case 'Shortlisted': return <UserCheck className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      case 'Hired': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const statusOptions = ['All', 'Applied', 'Under Review', 'Interview', 'Shortlisted', 'Rejected', 'Hired'];
  const jobOptions = ['All', ...new Set(applications.map(app => app.jobTitle))];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesJob = jobFilter === 'All' || app.jobTitle === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusCount = (status: string) => {
    if (status === 'All') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

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
          <p className="text-2xl font-bold text-gray-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-purple-700">Under Review</p>
            <ClockIcon className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {applications.filter(app => app.status === 'Under Review').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">Shortlisted</p>
            <UserCheck className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {applications.filter(app => app.status === 'Shortlisted' || app.status === 'Interview').length}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-700">Rejected</p>
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700 mt-1">
            {applications.filter(app => app.status === 'Rejected').length}
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
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status} ({getStatusCount(status)})
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
              {jobOptions.filter(j => j !== 'All').map(job => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
            <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}
      </p>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden min-h-[320px]">
            <div className="p-6">
              {/* Header with Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {application.candidateName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{application.candidateName}</h3>
                    <p className="text-sm text-gray-500">{application.jobTitle} at {application.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Match Score */}
                  <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getScoreColor(application.matchScore)}`}>
                    <span>{application.matchScore}%</span>
                    <span className="text-xs">Match</span>
                  </div>
                </div>
              </div>

              {/* Candidate Details */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    {application.candidateEmail}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    {application.candidatePhone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {application.location}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {application.experience}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Applied: {application.appliedDate}
                  </div>
                </div>

                {/* Education */}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Education:</span> {application.education}
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Status and Action Buttons */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span>{application.status}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {/* View Button */}
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="View Application"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {/* Update Status Button */}
                    <button 
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                      title="Update Status"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    {/* Download Resume Button */}
                    <button 
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                      title="Download Resume"
                    >
                      <FileDown className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="More">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchQuery || statusFilter !== 'All' || jobFilter !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Start receiving applications by posting job openings'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredApplications.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing 1-{Math.min(filteredApplications.length, 6)} of {filteredApplications.length} applications
          </p>
          <div className="flex items-center space-x-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">3</button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
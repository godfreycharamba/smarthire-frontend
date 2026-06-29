import React, { useState } from 'react';
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
  Users,
  Briefcase,
  Calendar,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Building
} from 'lucide-react';

interface EmployerJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  postedDate: string;
  deadline: string;
  description: string;
  skills: string[];
  applicants: number;
  status: 'Active' | 'Closed' | 'Draft';
}

const EmployerJobPostings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobs, setJobs] = useState<EmployerJob[]>([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$150,000 - $200,000',
      type: 'Full-time',
      postedDate: '2024-01-15',
      deadline: '2024-02-15',
      description: 'We are looking for a Senior Software Engineer to join our team and build scalable systems.',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      applicants: 45,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Microsoft',
      location: 'Redmond, WA',
      salary: '$140,000 - $180,000',
      type: 'Full-time',
      postedDate: '2024-01-14',
      deadline: '2024-02-14',
      description: 'Lead product strategy and development for our cloud services team.',
      skills: ['Product Strategy', 'Agile', 'Azure', 'Leadership'],
      applicants: 32,
      status: 'Active'
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'Figma',
      location: 'San Francisco, CA',
      salary: '$120,000 - $160,000',
      type: 'Full-time',
      postedDate: '2024-01-13',
      deadline: '2024-02-13',
      description: 'Design beautiful and intuitive user interfaces for our design platform.',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      applicants: 28,
      status: 'Active'
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      salary: '$160,000 - $210,000',
      type: 'Contract',
      postedDate: '2024-01-12',
      deadline: '2024-02-12',
      description: 'Analyze streaming data to improve user recommendations and content strategy.',
      skills: ['Python', 'ML', 'SQL', 'Statistics'],
      applicants: 18,
      status: 'Closed'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      postedDate: '2024-01-11',
      deadline: '2024-02-11',
      description: 'Build and maintain CI/CD pipelines and cloud infrastructure for AWS services.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      applicants: 56,
      status: 'Active'
    },
    {
      id: 6,
      title: 'Frontend Developer',
      company: 'Stripe',
      location: 'Remote',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      postedDate: '2024-01-10',
      deadline: '2024-02-10',
      description: 'Build responsive and performant payment interfaces for millions of users.',
      skills: ['React', 'TypeScript', 'CSS', 'Next.js'],
      applicants: 41,
      status: 'Draft'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed': return 'bg-red-100 text-red-700 border-red-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Active': return <CheckCircle className="h-4 w-4" />;
      case 'Closed': return <XCircle className="h-4 w-4" />;
      case 'Draft': return <ClockIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Full-time': return 'bg-blue-100 text-blue-700';
      case 'Part-time': return 'bg-green-100 text-green-700';
      case 'Contract': return 'bg-orange-100 text-orange-700';
      case 'Internship': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['All', 'Active', 'Closed', 'Draft'];

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
        <button className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all">
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
          <p className="text-2xl font-bold text-gray-900 mt-1">{jobs.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">Active</p>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {jobs.filter(j => j.status === 'Active').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">Total Applicants</p>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {jobs.reduce((sum, job) => sum + job.applicants, 0)}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-700">New Applications</p>
            <Users className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-700 mt-1">12</p>
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
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
      </p>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
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
                        {job.company}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                  {getStatusIcon(job.status)}
                  <span>{job.status}</span>
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
                    Posted: {job.postedDate}
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {job.description}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Job Type and Applicants */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                    {job.type}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-1.5 text-gray-400" />
                    {job.applicants} applicants
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                    Deadline: {job.deadline}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center space-x-1.5">
                      <Users className="h-4 w-4" />
                      <span>View Applicants</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="h-4 w-4" />
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
      {filteredJobs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchQuery || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start posting jobs to attract top talent'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing 1-{Math.min(filteredJobs.length, 6)} of {filteredJobs.length} jobs
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

export default EmployerJobPostings;
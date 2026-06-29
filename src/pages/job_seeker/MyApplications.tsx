// pages/dashboard/components/MyApplications.tsx
import React, { useState } from 'react';
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
  
  ChevronDown
} from 'lucide-react';

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Offered' | 'Rejected';
  appliedDate: string;
  logo: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
}

const MyApplications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [applications] = useState<Application[]>([
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      status: 'Interview',
      appliedDate: '2024-01-15',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop',
      salary: '$150,000 - $200,000',
      type: 'Full-time'
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'Microsoft',
      location: 'Redmond, WA',
      status: 'Under Review',
      appliedDate: '2024-01-12',
      logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=100&fit=crop',
      salary: '$140,000 - $180,000',
      type: 'Full-time'
    },
    {
      id: 3,
      jobTitle: 'UX/UI Designer',
      company: 'Figma',
      location: 'San Francisco, CA',
      status: 'Offered',
      appliedDate: '2024-01-10',
      logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd8?w=100&h=100&fit=crop',
      salary: '$120,000 - $160,000',
      type: 'Full-time'
    },
    {
      id: 4,
      jobTitle: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      status: 'Applied',
      appliedDate: '2024-01-08',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop',
      salary: '$160,000 - $210,000',
      type: 'Contract'
    },
    {
      id: 5,
      jobTitle: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      status: 'Rejected',
      appliedDate: '2024-01-05',
      logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=100&fit=crop',
      salary: '$130,000 - $170,000',
      type: 'Full-time'
    },
    {
      id: 6,
      jobTitle: 'Frontend Developer',
      company: 'Stripe',
      location: 'Remote',
      status: 'Under Review',
      appliedDate: '2024-01-03',
      logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd8?w=100&h=100&fit=crop',
      salary: '$130,000 - $170,000',
      type: 'Full-time'
    },
    {
      id: 7,
      jobTitle: 'Backend Engineer',
      company: 'Spotify',
      location: 'New York, NY',
      status: 'Interview',
      appliedDate: '2023-12-28',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop',
      salary: '$145,000 - $185,000',
      type: 'Full-time'
    },
    {
      id: 8,
      jobTitle: 'ML Engineer',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      status: 'Applied',
      appliedDate: '2023-12-20',
      logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=100&fit=crop',
      salary: '$180,000 - $230,000',
      type: 'Full-time'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Applied': return <ClockIcon className="h-4 w-4" />;
      case 'Under Review': return <ClockIcon className="h-4 w-4" />;
      case 'Interview': return <Calendar className="h-4 w-4" />;
      case 'Offered': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Interview': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Offered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusCount = (status: string) => {
    if (status === 'All') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['All', 'Applied', 'Under Review', 'Interview', 'Offered', 'Rejected'];

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
          <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-sm text-green-700">Offers Received</p>
          <p className="text-2xl font-bold text-green-700">
            {applications.filter(app => app.status === 'Offered').length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 shadow-sm">
          <p className="text-sm text-yellow-700">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">
            {applications.filter(app => app.status === 'Under Review' || app.status === 'Interview').length}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 shadow-sm">
          <p className="text-sm text-red-700">Rejected</p>
          <p className="text-2xl font-bold text-red-700">
            {applications.filter(app => app.status === 'Rejected').length}
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
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status} ({getStatusCount(status)})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}
      </p>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left Section - Company and Job Info */}
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                      <img 
                        src={application.logo} 
                        alt={application.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                            {application.jobTitle}
                          </h3>
                          <p className="text-gray-600 text-sm">{application.company}</p>
                        </div>
                      </div>
                      
                      {/* Job Details */}
                      <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {application.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {application.type}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          Applied: {application.appliedDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Status and Actions */}
                <div className="flex flex-col items-end space-y-3">
                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span>{application.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
                  <span>
                    {application.status === 'Applied' && 'Application Submitted'}
                    {application.status === 'Under Review' && 'Under Review'}
                    {application.status === 'Interview' && 'Interview Stage'}
                    {application.status === 'Offered' && 'Offer Received 🎉'}
                    {application.status === 'Rejected' && 'Application Closed'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      application.status === 'Applied' ? 'w-1/4 bg-blue-500' :
                      application.status === 'Under Review' ? 'w-1/2 bg-yellow-500' :
                      application.status === 'Interview' ? 'w-3/4 bg-purple-500' :
                      application.status === 'Offered' ? 'w-full bg-green-500' :
                      'w-full bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredApplications.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500 text-sm">
            {searchQuery || statusFilter !== 'All' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start applying to jobs to track your applications here'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredApplications.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing 1-{Math.min(filteredApplications.length, 8)} of {filteredApplications.length} applications
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

export default MyApplications;
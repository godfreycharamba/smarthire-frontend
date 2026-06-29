// pages/dashboard/employer/components/RankedCandidates.tsx
import React, { useState } from 'react';
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
  Edit3
} from 'lucide-react';

interface RankedCandidate {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  location: string;
  matchScore: number;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Shortlisted' | 'Rejected' | 'Hired';
  appliedDate: string;
  experience: string;
  education: string;
  skills: string[];
  avatar: string;
  resume: string;
  rank: number;
}

const RankedCandidates: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState('Senior Software Engineer');

  // Mock job data
  const jobs = [
    { id: 1, title: 'Senior Software Engineer', applicants: 45 },
    { id: 2, title: 'Product Manager', applicants: 32 },
    { id: 3, title: 'UX/UI Designer', applicants: 28 },
    { id: 4, title: 'Data Scientist', applicants: 18 },
    { id: 5, title: 'DevOps Engineer', applicants: 56 },
  ];

  // Mock ranked candidates data
  const [candidates] = useState<RankedCandidate[]>([
    {
      id: 1,
      name: 'Sarah',
      surname: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      matchScore: 94,
      status: 'Interview',
      appliedDate: '2024-01-15',
      experience: '8 years',
      education: 'M.S. Computer Science, Stanford University',
      skills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript'],
      avatar: 'SJ',
      resume: 'Sarah_Johnson_Resume.pdf',
      rank: 1
    },
    {
      id: 2,
      name: 'Michael',
      surname: 'Chen',
      email: 'michael.c@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Seattle, WA',
      matchScore: 87,
      status: 'Under Review',
      appliedDate: '2024-01-14',
      experience: '6 years',
      education: 'MBA, Harvard Business School',
      skills: ['Product Strategy', 'Agile', 'Azure', 'Leadership'],
      avatar: 'MC',
      resume: 'Michael_Chen_Resume.pdf',
      rank: 2
    },
    {
      id: 3,
      name: 'Emily',
      surname: 'Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1 (555) 345-6789',
      location: 'New York, NY',
      matchScore: 82,
      status: 'Shortlisted',
      appliedDate: '2024-01-13',
      experience: '5 years',
      education: 'BFA in Design, RISD',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      avatar: 'ER',
      resume: 'Emily_Rodriguez_Resume.pdf',
      rank: 3
    },
    {
      id: 4,
      name: 'Priya',
      surname: 'Patel',
      email: 'priya.p@email.com',
      phone: '+1 (555) 789-0123',
      location: 'Austin, TX',
      matchScore: 79,
      status: 'Under Review',
      appliedDate: '2024-01-09',
      experience: '5 years',
      education: 'M.S. Software Engineering, CMU',
      skills: ['React', 'Java', 'Spring Boot', 'MongoDB'],
      avatar: 'PP',
      resume: 'Priya_Patel_Resume.pdf',
      rank: 4
    },
    {
      id: 5,
      name: 'James',
      surname: 'Wilson',
      email: 'james.w@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Los Angeles, CA',
      matchScore: 76,
      status: 'Applied',
      appliedDate: '2024-01-12',
      experience: '4 years',
      education: 'Ph.D. Statistics, UC Berkeley',
      skills: ['Python', 'ML', 'SQL', 'Statistics'],
      avatar: 'JW',
      resume: 'James_Wilson_Resume.pdf',
      rank: 5
    },
    {
      id: 6,
      name: 'David',
      surname: 'Park',
      email: 'david.p@email.com',
      phone: '+1 (555) 678-9012',
      location: 'Remote',
      matchScore: 71,
      status: 'Shortlisted',
      appliedDate: '2024-01-10',
      experience: '7 years',
      education: 'M.S. Computer Science, MIT',
      skills: ['React', 'TypeScript', 'CSS', 'Next.js'],
      avatar: 'DP',
      resume: 'David_Park_Resume.pdf',
      rank: 6
    },
    {
      id: 7,
      name: 'Amanda',
      surname: 'Lee',
      email: 'amanda.l@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Portland, OR',
      matchScore: 65,
      status: 'Rejected',
      appliedDate: '2024-01-11',
      experience: '3 years',
      education: 'B.S. Computer Engineering, UT Austin',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      avatar: 'AL',
      resume: 'Amanda_Lee_Resume.pdf',
      rank: 7
    },
    {
      id: 8,
      name: 'Ryan',
      surname: 'Thompson',
      email: 'ryan.t@email.com',
      phone: '+1 (555) 890-1234',
      location: 'Chicago, IL',
      matchScore: 58,
      status: 'Rejected',
      appliedDate: '2024-01-08',
      experience: '6 years',
      education: 'MBA, Chicago Booth',
      skills: ['Product Strategy', 'Analytics', 'User Research'],
      avatar: 'RT',
      resume: 'Ryan_Thompson_Resume.pdf',
      rank: 8
    }
  ]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400 fill-current" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-semibold text-gray-400">#{rank}</span>;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return 'bg-blue-100 text-blue-700';
      case 'Under Review': return 'bg-yellow-100 text-yellow-700';
      case 'Interview': return 'bg-purple-100 text-purple-700';
      case 'Shortlisted': return 'bg-indigo-100 text-indigo-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Hired': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Applied': return <ClockIcon className="h-3 w-3" />;
      case 'Under Review': return <ClockIcon className="h-3 w-3" />;
      case 'Interview': return <Calendar className="h-3 w-3" />;
      case 'Shortlisted': return <UserCheck className="h-3 w-3" />;
      case 'Rejected': return <XCircle className="h-3 w-3" />;
      case 'Hired': return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const statusOptions = ['All', 'Applied', 'Under Review', 'Interview', 'Shortlisted', 'Rejected', 'Hired'];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          candidate.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                key={job.id}
                onClick={() => setSelectedJob(job.title)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedJob === job.title
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {job.title}
                <span className={`ml-2 text-xs ${
                  selectedJob === job.title ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  ({job.applicants})
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
          <p className="text-2xl font-bold text-gray-900 mt-1">{candidates.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">Top Matches (80%+)</p>
            <Award className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {candidates.filter(c => c.matchScore >= 80).length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-purple-700">Interview Stage</p>
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {candidates.filter(c => c.status === 'Interview').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">Avg. Match Score</p>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {Math.round(candidates.reduce((sum, c) => sum + c.matchScore, 0) / candidates.length)}%
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
        Showing {filteredCandidates.length} {filteredCandidates.length === 1 ? 'candidate' : 'candidates'}
        {selectedJob && ` for ${selectedJob}`}
      </p>

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
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className={`hover:bg-gray-50 transition-colors ${
                  candidate.rank <= 3 ? 'bg-blue-50/20' : ''
                }`}>
                  {/* Rank */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getRankIcon(candidate.rank)}
                    </div>
                  </td>
                  
                  {/* Candidate Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {candidate.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{candidate.name}</span>
                    </div>
                  </td>
                  
                  {/* Surname */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{candidate.surname}</span>
                  </td>
                  
                  {/* Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                      {candidate.email}
                    </div>
                  </td>
                  
                  {/* Match Score */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(candidate.matchScore)}`}>
                        {candidate.matchScore}%
                      </div>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                      {getStatusIcon(candidate.status)}
                      <span>{candidate.status}</span>
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                        title="Download Resume"
                      >
                        <FileDown className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                        title="Update Status"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
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
      )}

      {/* Pagination */}
      {filteredCandidates.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing 1-{Math.min(filteredCandidates.length, 8)} of {filteredCandidates.length} candidates
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

export default RankedCandidates;
// pages/dashboard/components/JobPostings.tsx
import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  postedDate: string;
  description: string;
  skills: string[];
  logo: string;
  isSaved: boolean;
}

const JobPostings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$150,000 - $200,000',
      type: 'Full-time',
      postedDate: '2024-01-15',
      description: 'We are looking for a Senior Software Engineer to join our team and build scalable systems.',
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop',
      isSaved: false
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Microsoft',
      location: 'Redmond, WA',
      salary: '$140,000 - $180,000',
      type: 'Full-time',
      postedDate: '2024-01-14',
      description: 'Lead product strategy and development for our cloud services team.',
      skills: ['Product Strategy', 'Agile', 'Azure', 'Leadership'],
      logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=100&fit=crop',
      isSaved: true
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'Figma',
      location: 'San Francisco, CA',
      salary: '$120,000 - $160,000',
      type: 'Full-time',
      postedDate: '2024-01-13',
      description: 'Design beautiful and intuitive user interfaces for our design platform.',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd8?w=100&h=100&fit=crop',
      isSaved: false
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      salary: '$160,000 - $210,000',
      type: 'Contract',
      postedDate: '2024-01-12',
      description: 'Analyze streaming data to improve user recommendations and content strategy.',
      skills: ['Python', 'ML', 'SQL', 'Statistics'],
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop',
      isSaved: false
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      postedDate: '2024-01-11',
      description: 'Build and maintain CI/CD pipelines and cloud infrastructure for AWS services.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=100&fit=crop',
      isSaved: false
    },
    {
      id: 6,
      title: 'Frontend Developer',
      company: 'Stripe',
      location: 'Remote',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      postedDate: '2024-01-10',
      description: 'Build responsive and performant payment interfaces for millions of users.',
      skills: ['React', 'TypeScript', 'CSS', 'Next.js'],
      logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd8?w=100&h=100&fit=crop',
      isSaved: false
    }
  ]);

  const toggleSave = (jobId: number) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Full-time': return 'bg-green-100 text-green-700';
      case 'Part-time': return 'bg-blue-100 text-blue-700';
      case 'Contract': return 'bg-orange-100 text-orange-700';
      case 'Internship': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
            <option>All Types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Highest Salary</option>
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

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <div className="p-6">
              {/* Company Logo and Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                    <img 
                      src={job.logo} 
                      alt={job.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{job.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSave(job.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {job.isSaved ? (
                    <BookmarkCheck className="h-5 w-5 text-blue-600 fill-current" />
                  ) : (
                    <Bookmark className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
                  )}
                </button>
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
                    {job.postedDate}
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

                {/* Job Type Badge and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                    {job.type}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      Quick Apply
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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

export default JobPostings;
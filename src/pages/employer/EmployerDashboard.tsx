// pages/dashboard/employer/components/EmployerDashboard.tsx
import React from 'react';
import {
  Briefcase,
  Users,
  TrendingUp,
  Award,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  Star,
  BarChart3,
  PieChart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie,
  
} from 'recharts';

interface RecentJob {
  id: number;
  title: string;
  location: string;
  postedDate: string;
  applicants: number;
  status: 'Active' | 'Closed' | 'Draft';
}

interface RecentApplication {
  id: number;
  name: string;
  job: string;
  matchScore: number;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Shortlisted' | 'Rejected' | 'Hired';
  appliedDate: string;
  avatar: string;
}

const EmployerDashboard: React.FC = () => {
  // Summary Cards Data
  const summaryCards = [
    { 
      label: 'Total Jobs', 
      value: 24, 
      icon: Briefcase, 
      color: 'blue',
      change: '+4 this month'
    },
    { 
      label: 'Total Applications', 
      value: 342, 
      icon: Users, 
      color: 'purple',
      change: '+28 this week'
    },
    { 
      label: 'Avg. Match Score', 
      value: '78%', 
      icon: TrendingUp, 
      color: 'green',
      change: '+5% improvement'
    },
    { 
      label: 'Top Candidates', 
      value: '12', 
      icon: Award, 
      color: 'yellow',
      change: '90%+ match score'
    },
  ];

  // Recent Job Postings (removed matchAvg)
  const recentJobs: RecentJob[] = [
    { id: 1, title: 'Senior Software Engineer', location: 'Mountain View, CA', postedDate: '2024-01-15', applicants: 45, status: 'Active' },
    { id: 2, title: 'Product Manager', location: 'Redmond, WA', postedDate: '2024-01-14', applicants: 32, status: 'Active' },
    { id: 3, title: 'UX/UI Designer', location: 'San Francisco, CA', postedDate: '2024-01-13', applicants: 28, status: 'Active' },
    { id: 4, title: 'Data Scientist', location: 'Los Gatos, CA', postedDate: '2024-01-12', applicants: 18, status: 'Closed' },
    { id: 5, title: 'DevOps Engineer', location: 'Seattle, WA', postedDate: '2024-01-11', applicants: 56, status: 'Active' },
  ];

  // Recent Applications
  const recentApplications: RecentApplication[] = [
    { id: 1, name: 'Sarah Johnson', job: 'Senior Software Engineer', matchScore: 94, status: 'Interview', appliedDate: '2 hours ago', avatar: 'SJ' },
    { id: 2, name: 'Michael Chen', job: 'Product Manager', matchScore: 87, status: 'Under Review', appliedDate: '4 hours ago', avatar: 'MC' },
    { id: 3, name: 'Emily Rodriguez', job: 'UX/UI Designer', matchScore: 82, status: 'Shortlisted', appliedDate: '1 day ago', avatar: 'ER' },
    { id: 4, name: 'Priya Patel', job: 'Senior Software Engineer', matchScore: 79, status: 'Under Review', appliedDate: '2 days ago', avatar: 'PP' },
    { id: 5, name: 'James Wilson', job: 'Data Scientist', matchScore: 76, status: 'Applied', appliedDate: '2 days ago', avatar: 'JW' },
  ];

  // Applications per Job Chart Data
  const jobChartData = [
    { job: 'DevOps Engineer', applications: 56 },
    { job: 'Senior Software Engineer', applications: 45 },
    { job: 'Frontend Developer', applications: 41 },
    { job: 'Product Manager', applications: 32 },
    { job: 'UX/UI Designer', applications: 28 },
    { job: 'Data Scientist', applications: 18 },
  ];

  // Candidate Match Score Distribution Data
  const matchScoreData = [
    { range: '90–100%', candidates: 5, color: '#10B981' },
    { range: '80–89%', candidates: 8, color: '#3B82F6' },
    { range: '70–79%', candidates: 7, color: '#F59E0B' },
    { range: 'Below 70%', candidates: 5, color: '#EF4444' },
  ];

  const COLORS = ['#8B5CF6', '#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EF4444'];
  const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      case 'Draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getApplicationStatusColor = (status: string) => {
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

  const getApplicationStatusIcon = (status: string) => {
    switch(status) {
      case 'Applied': return <Clock className="h-3 w-3" />;
      case 'Under Review': return <Clock className="h-3 w-3" />;
      case 'Interview': return <Calendar className="h-3 w-3" />;
      case 'Shortlisted': return <UserCheck className="h-3 w-3" />;
      case 'Rejected': return <XCircle className="h-3 w-3" />;
      case 'Hired': return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Custom Tooltip for Bar Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <p className="font-medium text-gray-900">{payload[0].payload.job}</p>
          <p className="text-sm text-gray-600">
            Applications: <span className="font-bold text-blue-600">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Candidates: <span className="font-bold text-blue-600">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend for Pie Chart
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-3 mt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center text-xs">
            <span 
              className="w-3 h-3 rounded-full mr-1.5" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">
            AI-powered insights for your recruitment process
          </p>
        </div>
        <button className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all">
          <Plus className="h-5 w-5" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
              <div className={`p-2 bg-${card.color}-50 rounded-lg`}>
                <card.icon className={`h-4 w-4 text-${card.color}-600`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications per Job Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Applications per Job</h3>
            </div>
            <span className="text-xs text-gray-400">Top 6</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={jobChartData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="job" 
                  type="category" 
                  width={100}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="applications" radius={[0, 4, 4, 0]}>
                  {jobChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Total Applications</span>
              <span className="font-semibold text-gray-900">
                {jobChartData.reduce((sum, item) => sum + item.applications, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Candidate Match Score Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Match Score Distribution</h3>
            </div>
            <span className="text-xs text-gray-400">For Senior Software Engineer</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={matchScoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="candidates"
                    nameKey="range"
                  >
                    {matchScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 min-w-[140px]">
              {matchScoreData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.range}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.candidates}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Total Candidates</span>
                  <span className="font-semibold text-gray-900">
                    {matchScoreData.reduce((sum, item) => sum + item.candidates, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Job Postings Table (removed Avg. Match column) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Job Postings</h3>
            <p className="text-sm text-gray-500">Latest job vacancies and applicant counts</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="pb-3 pr-4">Job Title</th>
                <th className="pb-3 pr-4">Location</th>
                <th className="pb-3 pr-4">Applicants</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="text-sm font-medium text-gray-900">{job.title}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      {job.location}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm text-gray-600">{job.applicants}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs text-gray-400">{job.postedDate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <p className="text-sm text-gray-500">Latest candidates ranked by AI match score</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View all applications
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="pb-3 pr-4">Candidate</th>
                <th className="pb-3 pr-4">Applied For</th>
                <th className="pb-3 pr-4">AI Match Score</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {app.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{app.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm text-gray-600">{app.job}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center space-x-2">
                      {app.matchScore >= 80 && (
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      )}
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            app.matchScore >= 80 ? 'bg-green-500' : 
                            app.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${app.matchScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${getScoreColor(app.matchScore)}`}>
                        {app.matchScore}%
                      </span>
                      {app.matchScore >= 80 && (
                        <span className="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                          Top Match
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusColor(app.status)}`}>
                      {getApplicationStatusIcon(app.status)}
                      <span>{app.status}</span>
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs text-gray-400">{app.appliedDate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Dashboard Summary Note */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex flex-wrap items-center gap-3 text-gray-500">
              <span className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                Top Match: 90%+
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                Good: 80-89%
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                Avg: 60-79%
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                Low: Below 60%
              </span>
            </div>
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
              🤖 AI-powered candidate ranking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
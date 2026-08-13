// pages/dashboard/employer/components/EmployerDashboard.tsx
import React, { useState, useEffect } from 'react';
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
  PieChart,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
import dashboardService from '../../services/dashboard_service';
import { toast } from 'react-hot-toast';

interface DashboardData {
  summary: {
    total_jobs: number;
    total_applications: number;
    average_match_score: number;
    top_candidates: number;
  };
  applications_per_job: {
    job_id: string;
    job_title: string;
    applications: number;
  }[];
  match_score_distribution: {
    "90_100": number;
    "80_89": number;
    "70_79": number;
    "below_70": number;
  };
  recent_jobs: {
    job_id: string;
    title: string;
    location: string;
    posted_date: string;
    applicants: number;
    status: string;
  }[];
  recent_applications: {
    application_id: string;
    candidate_name: string;
    job_title: string;
    match_score: number;
    status: string;
    applied_date: string;
  }[];
}

const EmployerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getEmployerDashboard();
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error: any) {
      console.error('Error fetching dashboard:', error);
      toast.error(error.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Summary Cards Data from API
  const summaryCards = dashboardData ? [
    { 
      label: 'Total Jobs', 
      value: dashboardData.summary.total_jobs, 
      icon: Briefcase, 
      color: 'blue',
    },
    { 
      label: 'Total Applications', 
      value: dashboardData.summary.total_applications, 
      icon: Users, 
      color: 'purple',
    },
    { 
      label: 'Avg. Match Score', 
      value: `${dashboardData.summary.average_match_score}%`, 
      icon: TrendingUp, 
      color: 'green',
    },
    { 
      label: 'Top Candidates', 
      value: dashboardData.summary.top_candidates, 
      icon: Award, 
      color: 'yellow',
    },
  ] : [];

  // Applications per Job Chart Data
  const jobChartData = dashboardData?.applications_per_job || [];

  // Match Score Distribution Data
  const matchScoreData = dashboardData ? [
    { range: '90–100%', candidates: dashboardData.match_score_distribution["90_100"], color: '#10B981' },
    { range: '80–89%', candidates: dashboardData.match_score_distribution["80_89"], color: '#3B82F6' },
    { range: '70–79%', candidates: dashboardData.match_score_distribution["70_79"], color: '#F59E0B' },
    { range: 'Below 70%', candidates: dashboardData.match_score_distribution["below_70"], color: '#EF4444' },
  ] : [];

  const COLORS = ['#8B5CF6', '#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EF4444'];


  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDisplayStatus = (status: string) => {
    switch(status) {
      case 'active': return 'Active';
      case 'closed': return 'Closed';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under_review': return 'bg-yellow-100 text-yellow-700';
      case 'interviewed': return 'bg-purple-100 text-purple-700';
      case 'shortlisted': return 'bg-indigo-100 text-indigo-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'hired': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getApplicationDisplayStatus = (status: string) => {
    switch(status) {
      case 'submitted': return 'Applied';
      case 'under_review': return 'Under Review';
      case 'interviewed': return 'Interview';
      case 'shortlisted': return 'Shortlisted';
      case 'rejected': return 'Rejected';
      case 'hired': return 'Hired';
      default: return status;
    }
  };

  const getApplicationStatusIcon = (status: string) => {
    switch(status) {
      case 'submitted': return <Clock className="h-3 w-3" />;
      case 'under_review': return <Clock className="h-3 w-3" />;
      case 'interviewed': return <Calendar className="h-3 w-3" />;
      case 'shortlisted': return <UserCheck className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      case 'hired': return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  // Custom Tooltip for Bar Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <p className="font-medium text-gray-900">{payload[0].payload.job_title}</p>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No dashboard data available</h3>
        <p className="text-gray-500">Start posting jobs to see insights here</p>
      </div>
    );
  }

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
  {jobChartData.length === 0 ? (
    <div className="flex items-center justify-center h-[260px] text-gray-400 text-sm">
      No applications yet
    </div>
  ) : (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={jobChartData}
          layout="vertical"
          margin={{ top: 20, right: 10, left: 5, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="job_title" 
            type="category" 
            width={100}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="applications" 
            radius={[0, 4, 4, 0]}
            barSize={40}
          >
            {jobChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )}
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
            <span className="text-xs text-gray-400">All Jobs</span>
          </div>
          {matchScoreData.every(item => item.candidates === 0) ? (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              No match scores yet
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="h-[220px] w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                   <Pie
                      data={matchScoreData.filter(item => item.candidates > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="candidates"
                      nameKey="range"
                    >
                      {matchScoreData.filter(item => item.candidates > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
          )}
        </div>
      </div>

      {/* Recent Job Postings Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Job Postings</h3>
            <p className="text-sm text-gray-500">Latest job vacancies and applicant counts</p>
          </div>
         
        </div>
        {dashboardData.recent_jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No jobs posted yet
          </div>
        ) : (
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
                {dashboardData.recent_jobs.map((job) => (
                  <tr key={job.job_id} className="hover:bg-gray-50 transition-colors">
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
                        {getDisplayStatus(job.status)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-gray-400">{formatDate(job.posted_date)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <p className="text-sm text-gray-500">Latest candidates ranked by AI match score</p>
          </div>
          
        </div>
        {dashboardData.recent_applications.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No applications received yet
          </div>
        ) : (
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
                {dashboardData.recent_applications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {getInitials(app.candidate_name)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{app.candidate_name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-sm text-gray-600">{app.job_title}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-2">
                        {app.match_score >= 80 && (
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        )}
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              app.match_score >= 80 ? 'bg-green-500' : 
                              app.match_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${app.match_score}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${getScoreColor(app.match_score)}`}>
                          {Math.round(app.match_score)}%
                        </span>
                        {app.match_score >= 80 && (
                          <span className="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                            Top Match
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusColor(app.status)}`}>
                        {getApplicationStatusIcon(app.status)}
                        <span>{getApplicationDisplayStatus(app.status)}</span>
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-gray-400">{formatDate(app.applied_date)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
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
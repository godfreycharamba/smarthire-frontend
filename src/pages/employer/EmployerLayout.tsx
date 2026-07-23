
import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
 LayoutDashboard,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  Award,
 
  
} from 'lucide-react';
import EmployerJobPostings from './EmployerJobPostings';
import SignOutModal from '../../components/SignOutModal';
import EmployerApplications from './EmployerApplications';
import EmployerDashboard from './EmployerDashboard';
import RankedCandidates from './RankedCandidates';

const EmployerLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('job-postings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'job-postings', label: 'Job Postings', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'candidates', label: 'Ranked Candidates', icon: Award },
  
    
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'job-postings':
        return <EmployerJobPostings />;
      case 'dashboard':
        return <EmployerDashboard />

      case 'applications':
        return <EmployerApplications/>
        
      case 'candidates':
        return <RankedCandidates/>
          
      
      
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SmartHire
              </h1>
              <p className="text-xs text-gray-500">Employer Portal</p>
            </div>
          </div>
        </div>

        {/* User Profile Summary */}
        {/* <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              JD
            </div>
            <div>
              <p className="font-semibold text-gray-900">John Doe</p>
              <p className="text-sm text-gray-500">Google Inc.</p>
              <p className="text-xs text-gray-400">john.doe@google.com</p>
            </div>
          </div>
        </div> */}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${activeTab === item.id 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${activeTab === item.id ? 'text-blue-600' : ''}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.id === 'applications' && (
                      <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        12
                      </span>
                    )}
                    {item.id === 'candidates' && (
                      <span className="ml-auto bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        8
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setIsSignOutModalOpen(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
       

{/* Header */}
<header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
  <div className="px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        
        {/* Active Tab Display */}
        <div className="hidden lg:block">
          <h2 className="text-xl font-semibold text-gray-900">
            {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <p className="text-xs text-gray-500">
            {activeTab === 'dashboard'}
            {activeTab === 'job-postings'}
            {activeTab === 'applications'}
            {activeTab === 'candidates' }
          </p>
        </div>
        
        {/* Mobile Active Tab */}
        <div className="lg:hidden">
          <h2 className="text-lg font-bold text-gray-900">
            {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search - Desktop */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  </div>
</header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
      />
    </div>
  );
};

export default EmployerLayout;
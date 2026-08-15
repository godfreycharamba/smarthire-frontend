
import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  User,
  
  Bell,
  Search,
  LogOut,
  Menu,
  Bookmark
} from 'lucide-react';

import JobPostings from './JobPostings';
import MyApplications from './MyApplications';
import MyProfile from './MyProfile';
import SignOutModal from '../../components/SignOutModal';
import UserMenuDropdown from '../../components/UserMenuDropdown';
import NotificationsDropdown from '../../components/NotificationsDropDown';

const JobSeekerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('job-postings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const sidebarItems = [
    { id: 'job-postings', label: 'Job Postings', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'profile', label: 'My Profile', icon: User },
   
    
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'job-postings':
        return <JobPostings />;

      case 'applications':
        return <MyApplications/>
          
        
      case 'profile':
        return <MyProfile/>

     
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
              <p className="text-xs text-gray-500">Job Seeker Portal</p>
            </div>
          </div>
        </div>

       

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
                  
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button  onClick={() => setIsSignOutModalOpen(true)} className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
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
            {activeTab === 'saved-jobs'}
            {activeTab === 'job-postings'}
            {activeTab === 'applications'}
            {activeTab === 'profile'}
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
       

        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Menu */}
         <UserMenuDropdown onSignOut={() => setIsSignOutModalOpen(true)} />
      </div>
    </div>
  </div>
</header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
        <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
      />
    </div>
  );
};

export default JobSeekerDashboard;
// pages/dashboard/components/MyProfile.tsx
import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  Camera,
  
 
  Calendar,
  Building,
  School,
  
  CheckCircle,
  
} from 'lucide-react';
import { FaLinkedin,FaGithub, FaTwitter } from 'react-icons/fa';

interface Skill {
  id: number;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  bio: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
}

const MyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' as Skill['level'] });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    bio: 'Passionate software engineer with 8+ years of experience building scalable applications. Specialized in React, Node.js, and cloud technologies. Strong advocate for clean code and best practices.',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    twitter: 'https://twitter.com/johndoe',
    website: 'https://johndoe.dev',
    skills: [
      { id: 1, name: 'React', level: 'Expert' },
      { id: 2, name: 'TypeScript', level: 'Advanced' },
      { id: 3, name: 'Node.js', level: 'Advanced' },
      { id: 4, name: 'Python', level: 'Intermediate' },
      { id: 5, name: 'AWS', level: 'Advanced' },
      { id: 6, name: 'Docker', level: 'Intermediate' },
      { id: 7, name: 'GraphQL', level: 'Intermediate' },
      { id: 8, name: 'MongoDB', level: 'Advanced' },
    ],
    education: [
      {
        id: 1,
        institution: 'Stanford University',
        degree: 'Master of Science',
        field: 'Computer Science',
        startDate: '2014-09',
        endDate: '2016-06',
        current: false,
        description: 'Specialized in Artificial Intelligence and Machine Learning. Thesis on neural network optimization.'
      },
      {
        id: 2,
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Software Engineering',
        startDate: '2010-09',
        endDate: '2014-06',
        current: false,
        description: 'Graduated with honors. Focus on software architecture and distributed systems.'
      }
    ],
    experience: [
      {
        id: 1,
        company: 'Google',
        position: 'Senior Software Engineer',
        location: 'Mountain View, CA',
        startDate: '2020-01',
        endDate: '',
        current: true,
        description: 'Leading a team of 8 engineers building scalable cloud infrastructure. Implemented microservices architecture serving millions of requests per day.'
      },
      {
        id: 2,
        company: 'Microsoft',
        position: 'Software Engineer',
        location: 'Redmond, WA',
        startDate: '2016-07',
        endDate: '2019-12',
        current: false,
        description: 'Developed and maintained Azure cloud services. Improved system performance by 40% through optimization.'
      },
      {
        id: 3,
        company: 'Amazon',
        position: 'Junior Software Engineer',
        location: 'Seattle, WA',
        startDate: '2014-06',
        endDate: '2016-06',
        current: false,
        description: 'Built and maintained e-commerce backend services. Implemented caching solutions reducing response time by 60%.'
      }
    ]
  });

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Expert': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Advanced': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Intermediate': return 'bg-green-100 text-green-700 border-green-200';
      case 'Beginner': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: Date.now(),
        name: newSkill.name,
        level: newSkill.level
      };
      setProfile({
        ...profile,
        skills: [...profile.skills, skill]
      });
      setNewSkill({ name: '', level: 'Intermediate' });
      setShowAddSkill(false);
    }
  };

  const handleDeleteSkill = (id: number) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill.id !== id)
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setIsUploading(true);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setTimeout(() => {
            setUploadProgress(0);
            setResumeFile(null);
          }, 2000);
        }
      }, 300);
    }
  };

  const sectionTabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal information and professional details
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all ${
            isEditing 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? (
            <>
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Profile Header with Avatar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full border-2 border-white hover:bg-blue-600 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-blue-100">{profile.title}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-blue-100">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.location}
              </span>
              <span className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {profile.email}
              </span>
              <span className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {profile.phone}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
              <FaLinkedin className="h-5 w-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
              <FaGithub className="h-5 w-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
              <FaTwitter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Resume</h3>
              <p className="text-sm text-gray-500">Upload your latest resume for job applications</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {resumeFile && (
              <span className="text-sm text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                {resumeFile.name}
              </span>
            )}
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                isUploading 
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}>
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : 'Upload Resume'}
                </span>
              </div>
            </label>
          </div>
        </div>
        {isUploading && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
          </div>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 space-x-1">
        {sectionTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeSection === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Personal Info Section */}
        {activeSection === 'personal' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              {isEditing && (
                <button
                  onClick={() => setShowAddExperience(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Experience</span>
                </button>
              )}
            </div>
            <div className="space-y-6">
              {profile.experience.map((exp) => (
                <div key={exp.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {exp.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                        {exp.current && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-600 text-sm">{exp.description}</p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => {
                          setProfile({
                            ...profile,
                            experience: profile.experience.filter(e => e.id !== exp.id)
                          });
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              {isEditing && (
                <button
                  onClick={() => setShowAddEducation(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Education</span>
                </button>
              )}
            </div>
            <div className="space-y-6">
              {profile.education.map((edu) => (
                <div key={edu.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <School className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </span>
                        {edu.current && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-600 text-sm">{edu.description}</p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => {
                          setProfile({
                            ...profile,
                            education: profile.education.filter(e => e.id !== edu.id)
                          });
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              {isEditing && (
                <button
                  onClick={() => setShowAddSkill(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skill</span>
                </button>
              )}
            </div>
            
            {/* Add Skill Form */}
            {showAddSkill && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                      placeholder="e.g., React, Python, AWS"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({...newSkill, level: e.target.value as Skill['level']})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddSkill(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Grid */}
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getLevelColor(skill.level)}`}
                >
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-xs opacity-75">• {skill.level}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
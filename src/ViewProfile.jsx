import { useState } from 'react';
import {
  Mail, 
  Phone, 
  MapPin,
  Shield,
  Camera,
  Edit,
  Key,
  Radio,
  ChevronRight,
} from 'lucide-react';
import Sidebar from './SideBar';

const ViewProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample profile data
  const profileData = {
    fullName: "Admin User",
    role: "Administrator",
    email: "admin@example.com",
    phone: "+63 (966) 123-4567",
    location: "Quezon City, Philippines",
    department: "Management",
    joinDate: "January 2025",
    lastActive: "2 hours ago",
    recentActivities: [
      {
        id: 1,
        action: "Updated resident record",
        time: "2 hours ago",
        details: "Modified health information for Room 101"
      },
      {
        id: 2,
        action: "Added new resident",
        time: "5 hours ago",
        details: "Registered Maria Garcia in Room 205"
      },
      {
        id: 3,
        action: "Generated report",
        time: "1 day ago",
        details: "Monthly resident statistics report"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar activePage="profile" />
      
      <div className="ml-72 p-8">
        {/* Header Section */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Card */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
                <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>
              
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-6">
                  <div className="relative">
                    <div className="h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
                      A
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="pt-14">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{profileData.fullName}</h2>
                      <p className="text-gray-500">{profileData.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <span className="text-sm">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 text-gray-500" />
                      </div>
                      <span className="text-sm">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <span className="text-sm">{profileData.location}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-500">Department</p>
                        <p className="font-medium text-gray-900 mt-1">{profileData.department}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-900 mt-1">{profileData.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20">
              <div className="flex gap-2">
                {['overview', 'security'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors
                      ${activeTab === tab 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Overview */}
            {activeTab === 'overview' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {profileData.recentActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Radio className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{activity.action}</h4>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Key className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">Password</h4>
                        <p className="text-sm text-gray-500">Change your password</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add extra security to your account</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
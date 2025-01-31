import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  Camera,
  Edit,
  Key,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Sidebar from "./SideBar";

const ViewProfile = () => {
  const profileData = {
    fullName: "Admin User",
    role: "Administrator",
    email: "admin@example.com",
    phone: "+63 (966) 123-4567",
    location: "Quezon City, Philippines",
    department: "Management",
    joinDate: "January 2025",
    lastActive: "2 hours ago",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-poppins">
      <Sidebar activePage="profile" />

      <div className="ml-72 p-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Card */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-40 bg-gradient-to-r from-cyan-500 to-blue-600">
                <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="relative px-6 pb-6">
                <div className="absolute -top-16 left-6">
                  <div className="relative">
                    <div className="h-32 w-32 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white">
                      A
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="pt-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {profileData.fullName}
                      </h2>
                      <p className="text-gray-500">{profileData.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <Phone className="h-5 w-5 text-gray-500" />
                      </div>
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <span>{profileData.location}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500">Department</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {profileData.department}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Member Since</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {profileData.joinDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Security Settings
              </h3>
              <div className="space-y-6">
                <button className="w-full flex items-center justify-between p-6 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                      <Key className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-gray-500">Change your password</p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-6 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-gray-500">
                        Add extra security to your account
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;

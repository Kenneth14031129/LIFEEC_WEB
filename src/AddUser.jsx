import { useState } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  Search,
  Filter,
  Archive,
  Eye,
  EyeOff,
  Shield,
  User,
  Users,
} from "lucide-react";
import Sidebar from "./SideBar";

const AddUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "",
  });

  // Sample registered users data
  const registeredUsers = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      userType: "Admin",
      status: "Active",
      lastLogin: "2024-01-08 09:30 AM",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      userType: "Staff",
      status: "Active",
      lastLogin: "2024-01-08 10:15 AM",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status) => {
    return status.toLowerCase() === "active"
      ? "text-green-500 bg-green-50 border border-green-200"
      : "text-gray-500 bg-gray-50 border border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar activePage="add-user" />

      <div className="ml-72 p-8">
        {/* Header Section */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add User
              </h1>
              <p className="text-gray-600 mt-1">Add and manage system users</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Add User Form */}
          <div className="col-span-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-50">
                  <UserPlus className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New User
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type *
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="userType"
                      required
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 appearance-none"
                    >
                      <option value="">Select user type</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Add User
                </button>
              </form>
            </div>
          </div>

          {/* Registered Users */}
          <div className="col-span-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-50">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Registered Users
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100">
                    <Filter className="h-5 w-5" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Last Login
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-medium">
                              {user.fullName.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">
                              {user.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                            {user.userType}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {user.lastLogin}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Archive user"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

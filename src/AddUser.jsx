import { useState, useEffect } from "react";
import { getUsers, addUser } from "../services/api";
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
  X,
} from "lucide-react";
import Sidebar from "./SideBar";

const AddUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "",
  });

  const filterOptions = ["Admin", "Owner","Nurse", "Nutritionist", "Relative"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const newUser = await addUser(formData);
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setFormData({
        fullName: "",
        email: "",
        password: "",
        userType: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilters.length === 0 ||
      selectedFilters.includes(user.userType.charAt(0).toUpperCase() + user.userType.slice(1));
    
    return matchesSearch && matchesFilter;
  });

  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4" role="alert">{error}</div>;
  }

  const getStatusColor = (status) => {
    return status.toLowerCase() === "active"
      ? "text-green-500 bg-green-50 border border-green-200"
      : "text-gray-500 bg-gray-50 border border-gray-200";
  };

  return (
    <div className="font-[Poppins]">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar activePage="add-user" />

        <div className="ml-72 p-8">
          {/* Header Section */}
          <div className="mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Add User
                </h1>
                <p className="text-gray-600 mt-1">
                  Add and manage system users
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Add User Form */}
            <div className="col-span-4">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-blue-50">
                    <UserPlus className="h-6 w-6 text-cyan-500" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Add New User
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <input
                        id="fullName"
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <input
                        id="email"
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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <input
                        id="password"
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
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* User Type */}
                  <div>
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                      User Type *
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <select
                        id="userType"
                        name="userType"
                        required
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 appearance-none"
                      >
                        <option value="">Select user type</option>
                        <option value="nurse">Nurse</option>
                        <option value="nutritionist">Nutritionist</option>
                        <option value="relative">Relative</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <UserPlus className="h-5 w-5" aria-hidden="true" />
                    )}
                    {isSubmitting ? "Adding User..." : "Add User"}
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
                      <Users className="h-6 w-6 text-cyan-500" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Registered Users
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="relative">
                      <label htmlFor="user-search" className="sr-only">Search users</label>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <input
                        id="user-search"
                        type="search"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Filter Button and Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100"
                        aria-expanded={isFilterOpen}
                        aria-controls="filter-menu"
                      >
                        <Filter className="h-5 w-5" aria-hidden="true" />
                        <span>Filter</span>
                        {selectedFilters.length > 0 && (
                          <span className="ml-1 px-2 py-0.5 text-sm bg-blue-100 text-blue-600 rounded-full">
                            {selectedFilters.length}
                          </span>
                        )}
                      </button>

                      {isFilterOpen && (
                        <div
                          id="filter-menu"
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-10"
                          role="menu"
                        >
                          <div className="p-2">
                            <div className="flex justify-between items-center p-2">
                              <span className="font-medium">Filter by Type</span>
                              {selectedFilters.length > 0 && (
                                <button
                                  onClick={clearFilters}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                  aria-label="Clear all filters"
                                >
                                  Clear all
                                </button>
                              )}
                            </div>
                            <div className="space-y-1">
                              {filterOptions.map((option) => (
                                <label
                                  key={option}
                                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedFilters.includes(option)}
                                    onChange={() => toggleFilter(option)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                  <span className="ml-2">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected Filters Display */}
                {selectedFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedFilters.map((filter) => (
                      <span
                      key={filter}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {filter}
                      <button
                        onClick={() => toggleFilter(filter)}
                        className="hover:bg-blue-100 rounded-full p-0.5"
                        aria-label={`Remove ${filter} filter`}
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        User
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                        Type
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium">
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
                        <td className="px-4 py-4 text-center">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-cyan-500">
                            {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("Active")}`}
                          >
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              className="p-2 text-red-600 hover:bg-amber-50 rounded-lg transition-colors"
                              aria-label={`Archive ${user.fullName}`}
                            >
                              <Archive className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* No Results Message */}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found matching your search criteria
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default AddUser;
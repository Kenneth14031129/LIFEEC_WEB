import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  addUser,
  archiveUser,
  verifyUser,
  rejectUser,
} from "../services/api";
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
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Sidebar from "./SideBar";

const AddUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [userToArchive, setUserToArchive] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "",
  });

  const filterOptions = ["Nurse", "Nutritionist", "Relative"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        // Only show regular users in pending and registered lists
        const regularUsers = data.filter((user) =>
          ["nurse", "nutritionist", "relative"].includes(
            user.userType.toLowerCase()
          )
        );

        const active = regularUsers.filter((user) => user.isVerified);
        const pending = regularUsers.filter((user) => !user.isVerified);

        setUsers(active);
        setPendingUsers(pending);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const showConfirmDialog = (user, action) => {
    setSelectedUser(user);
    setConfirmAction(action);
    setIsConfirmDialogOpen(true);
  };

  const handleVerifyUser = async (user) => {
    showConfirmDialog(user, "verify");
  };

  const handleRejectUser = async (user) => {
    showConfirmDialog(user, "reject");
  };

  const handleConfirmAction = async () => {
    try {
      setIsSubmitting(true);
      if (confirmAction === "verify") {
        await verifyUser(selectedUser._id);
        setSuccessMessage(
          `${selectedUser.fullName} has been verified successfully!`
        );
      } else if (confirmAction === "reject") {
        await rejectUser(selectedUser._id);
        setSuccessMessage(
          `${selectedUser.fullName}'s registration has been rejected.`
        );
      }

      // Update the lists
      setPendingUsers((prev) =>
        prev.filter((user) => user._id !== selectedUser._id)
      );
      if (confirmAction === "verify") {
        setUsers((prev) => [...prev, { ...selectedUser, isVerified: true }]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      setIsConfirmDialogOpen(false);
      setSelectedUser(null);
      setConfirmAction(null);
    }
  };

  const handleArchive = async (user) => {
    setUserToArchive(user);
    setIsArchiveDialogOpen(true);
  };

  const confirmArchive = async () => {
    try {
      await archiveUser(userToArchive._id);
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u._id !== userToArchive._id)
      );
      setIsArchiveDialogOpen(false);
      navigate("/archive");
    } catch (err) {
      setError(err.message);
    }
  };

  // Validation rules
  const validateFullName = (name) => {
    if (!name) return "Full name is required";
    if (name.length < 5) return "Full name must be at least 5 characters";
    if (name.length > 30) return "Full name must be less than 30 characters";
    if (!/^[a-zA-Z\s]*$/.test(name))
      return "Full name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    // Regex that only allows .com top-level domain
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.com$/i;
    if (!emailRegex.test(email))
      return "Please enter a valid email address ending in .com (e.g., user@example.com)";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[_!@#$%^&*]/.test(password))
      return "Password must contain at least one special character (_!@#$%^&*)";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    let error = "";
    switch (name) {
      case "fullName":
        error = validateFullName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await addUser(formData);
      
      // Add user to pending list for regular users
      if (!["admin", "owner"].includes(formData.userType.toLowerCase())) {
        setPendingUsers((prev) => [...prev, response]);
      } else {
        // For admin/owner, directly add to active users
        setUsers((prev) => [...prev, { ...response, isVerified: true }]);
      }
      
      setFormData({
        fullName: "",
        email: "",
        password: "",
        userType: "",
      });
      setSuccessMessage("User added successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const filteredUsers = users.filter((user) => {
    // First check if the user is not an admin or owner
    const isRegularUser = !["admin", "owner"].includes(
      user.userType.toLowerCase()
    );

    // Then apply search and filter logic only to regular users
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.includes(
        user.userType.charAt(0).toUpperCase() + user.userType.slice(1)
      );

    return isRegularUser && matchesSearch && matchesFilter;
  });

  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4" role="alert">
        {error}
      </div>
    );
  }

  const getStatusColor = (status) => {
    return status.toLowerCase() === "active"
      ? "text-green-500 bg-green-50 border border-green-200"
      : "text-gray-500 bg-gray-50 border border-gray-200";
  };

  return (
    <div className="font-[Poppins]">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex items-center">
          <div className="flex-grow">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-4 text-green-700 hover:text-green-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
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
                    <UserPlus
                      className="h-6 w-6 text-cyan-500"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Add New User
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                          errors.fullName
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:ring-blue-500"
                        } focus:outline-none focus:ring-2 bg-gray-50/50`}
                        placeholder="Enter full name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:ring-blue-500"
                        } focus:outline-none focus:ring-2 bg-gray-50/50`}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password *
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                          errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:ring-blue-500"
                        } focus:outline-none focus:ring-2 bg-gray-50/50`}
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* User Type */}
                  <div>
                    <label
                      htmlFor="userType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      User Type *
                    </label>
                    <div className="relative">
                      <Shield
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <select
                        id="userType"
                        name="userType"
                        required
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 appearance-none"
                      >
                        <option value="">Select user type</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                        <option value="nurse">Nurse</option>
                        <option value="nutritionist">Nutritionist</option>
                        <option value="relative">Relative</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      errors.email ||
                      errors.fullName ||
                      errors.password
                    }
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Users Sections */}
            <div className="col-span-8 space-y-8">
              {/* Pending Users Section */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-50">
                      <Clock
                        className="h-6 w-6 text-amber-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Pending Users
                      </h2>
                    </div>
                  </div>
                  {pendingUsers.length > 0 && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                      {pendingUsers.length} pending
                    </span>
                  )}
                </div>

                {pendingUsers.length > 0 ? (
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
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                            Type
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingUsers.map((user) => (
                          <tr
                            key={user._id}
                            className="border-b border-gray-100 hover:bg-gray-50/50"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-medium">
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
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-600">
                                {user.userType.charAt(0).toUpperCase() +
                                  user.userType.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleVerifyUser(user)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  aria-label={`Verify ${user.fullName}`}
                                >
                                  <CheckCircle
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </button>
                                <button
                                  onClick={() => handleRejectUser(user)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label={`Reject ${user.fullName}`}
                                >
                                  <XCircle
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No pending users to verify
                  </div>
                )}
              </div>

              {/* Registered Users */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50">
                      <Users
                        className="h-6 w-6 text-cyan-500"
                        aria-hidden="true"
                      />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Registered Users
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="relative">
                      <label htmlFor="user-search" className="sr-only">
                        Search users
                      </label>
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
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
                              <span className="font-medium">
                                Filter by Type
                              </span>
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
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-sm font-medium text-gray-500"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-sm font-medium text-gray-500"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-sm font-medium text-gray-500"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-sm font-medium text-gray-500"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-sm font-medium text-gray-500"
                        >
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
                              {user.userType.charAt(0).toUpperCase() +
                                user.userType.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                "Active"
                              )}`}
                            >
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleArchive(user)} // Add this onClick handler
                                className="p-2 text-red-600 hover:bg-amber-50 rounded-lg transition-colors"
                                aria-label={`Archive ${user.fullName}`}
                              >
                                <Archive
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
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
      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-xl ${
                  confirmAction === "verify" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {confirmAction === "verify" ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {confirmAction === "verify" ? "Verify User" : "Reject User"}
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              {confirmAction === "verify"
                ? `Are you sure you want to verify ${selectedUser?.fullName}? This will grant them access to the system.`
                : `Are you sure you want to reject ${selectedUser?.fullName}? This action cannot be undone.`}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsConfirmDialogOpen(false);
                  setSelectedUser(null);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  confirmAction === "verify"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : confirmAction === "verify" ? (
                  "Verify User"
                ) : (
                  "Reject User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {isArchiveDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Archive User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to archive {userToArchive?.fullName}? They
              will no longer be able to log in to the system.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsArchiveDialogOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchive}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Archive User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;

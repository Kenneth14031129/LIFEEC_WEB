import { useState, useEffect } from "react";
import { Archive, Search, Filter, X, RotateCcw } from "lucide-react";
import Sidebar from "./SideBar";
import { getArchivedUsers, restoreUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const ArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [userToRestore, setUserToRestore] = useState(null);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "sidebarCollapsed") {
        setIsCollapsed(JSON.parse(e.newValue));
      }
    };

    // Initial check
    const savedState = localStorage.getItem("sidebarCollapsed");
    setIsCollapsed(savedState ? JSON.parse(savedState) : false);

    // Listen for changes
    window.addEventListener("storage", handleStorageChange);

    // Add custom event listener for same-window updates
    window.addEventListener("sidebarStateChange", (e) => {
      setIsCollapsed(e.detail.isCollapsed);
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sidebarStateChange", handleStorageChange);
    };
  }, []);

  const filterOptions = ["Nurse", "Nutritionist", "Relative"];

  useEffect(() => {
    const fetchArchivedUsers = async () => {
      try {
        const data = await getArchivedUsers();
        setArchivedUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchArchivedUsers();
  }, []);

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

  const handleRestore = (user) => {
    setUserToRestore(user);
    setIsRestoreDialogOpen(true);
  };

  const confirmRestore = async () => {
    try {
      await restoreUser(userToRestore._id);
      setArchivedUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userToRestore._id)
      );
      setIsRestoreDialogOpen(false);
      navigate("/add-user");
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = archivedUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.includes(
        user.userType.charAt(0).toUpperCase() + user.userType.slice(1)
      );

    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <div className="text-red-500 p-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="font-[Poppins]">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar
          activePage="archive"
          onToggle={(collapsed) => setIsCollapsed(collapsed)}
        />

        <div
          className={`transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-24" : "ml-72"
          } p-8`}
        >
          {/* Header Section */}
          <div className="mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Archive
                </h1>
                <p className="text-gray-600 mt-1">
                  View and manage archived users
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Archive className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50">
                  <Archive
                    className="h-6 w-6 text-cyan-500"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Archived Users
                </h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Search Input */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    placeholder="Search archived users..."
                    className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filter Button */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100"
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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
                      <div className="p-2">
                        <div className="flex justify-between items-center p-2">
                          <span className="font-medium">Filter by Type</span>
                          {selectedFilters.length > 0 && (
                            <button
                              onClick={clearFilters}
                              className="text-sm text-blue-600 hover:text-blue-800"
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
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            )}

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
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                      Archived Date
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
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
                      <td className="px-4 py-4 text-gray-600">{user.email}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-cyan-500">
                          {user.userType.charAt(0).toUpperCase() +
                            user.userType.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">
                        {new Date(user.archivedDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleRestore(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Restore user"
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No archived users found matching your search criteria
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isRestoreDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Restore User
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to restore {userToRestore?.fullName}? They
              will be able to log in to the system again.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsRestoreDialogOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestore}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Restore User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;

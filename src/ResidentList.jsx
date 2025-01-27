import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Clock,
  Download,
  Printer,
  Share2,
  HeartPulse,
  MapPin,
  Cake,
  Heart,
  AlertTriangle,
  ArrowUpRight,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { getResidents } from "../services/api";
import Sidebar from "./SideBar";

const ResidentList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await getResidents();

      const transformedResidents = response.residents.map((resident) => ({
        id: resident._id,
        basicInfo: {
          name: resident.fullName,
          dateOfBirth: formatDate(resident.dateOfBirth),
          gender: resident.gender,
          contact: resident.contactNumber,
          email: resident.emergencyContact.email,
          joinDate: new Date(resident.createdAt).toISOString().split("T")[0],
          address: resident.address,
        },
        emergencyContact: {
          name: resident.emergencyContact.name,
          phone: resident.emergencyContact.phone,
          email: resident.emergencyContact.email,
          relation: resident.emergencyContact.relation,
        },
        health: {
          status: resident.status === "active" ? "Stable" : "Critical",
          lastUpdated: formatLastUpdated(resident.updatedAt),
        },
      }));

      setResidents(transformedResidents);
    } catch (err) {
      setError(err.message || "Error fetching residents");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatLastUpdated = (updatedAt) => {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffInHours = Math.floor((now - updated) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getStatusColor = (status) => {
    return status === "Critical"
      ? "bg-red-50 text-red-600 border-red-100"
      : "bg-green-50 text-green-600 border-green-100";
  };

  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = resident.basicInfo.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "critical")
      return matchesSearch && resident.health.status === "Critical";
    if (activeTab === "stable")
      return matchesSearch && resident.health.status === "Stable";
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar activePage="residents-list" />
        <div className="ml-72 p-8 flex items-center justify-center">
          <div className="text-gray-600">Loading residents...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar activePage="residents-list" />
        <div className="ml-72 p-8 flex items-center justify-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar activePage="residents-list" />

      <div className="ml-72 p-8">
        {/* Header Section */}
        <div className="mb-8 bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Residents List
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor resident information
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Printer className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search residents..."
                  className="pl-12 pr-4 py-3 w-72 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl max-w-md">
            {["all", "critical", "stable"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-2.5 rounded-lg capitalize text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-white/50"
                }`}
              >
                {tab} Residents
              </button>
            ))}
          </div>
        </div>

        {/* Resident Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResidents.map((resident) => (
            <div
              key={resident.id}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                    {resident.basicInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {resident.basicInfo.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {resident.basicInfo.address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Cake className="h-4 w-4" />
                    Date of Birth
                  </div>
                  <p className="font-semibold text-sm">
                    {resident.basicInfo.dateOfBirth}
                  </p>
                </div>
                <div className="p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Heart className="h-4 w-4" />
                    Gender
                  </div>
                  <p className="font-semibold">{resident.basicInfo.gender}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Health Status</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      resident.health.status
                    )}`}
                  >
                    {resident.health.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Last Updated</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {resident.health.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Emergency Contact Info */}
              <div className="space-y-3 mb-6 p-4 bg-gray-50/50 rounded-xl">
                <h4 className="font-medium text-gray-700">Emergency Contact</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{resident.emergencyContact.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{resident.emergencyContact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{resident.emergencyContact.email}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-colors">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Emergency Alert</span>
                  </button>
                  <button
                    onClick={() => navigate(`/residents/${resident.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    View Details
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResidentList;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  Users,
  AlertTriangle,
  Search,
  ChevronDown,
  X,
  Calendar,
  ArrowUpRight,
  UserPlus,
  Filter,
} from "lucide-react";
import Sidebar from "./SideBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showResidentHistory, setShowResidentHistory] = useState(false);
  const [showAlertHistory, setShowAlertHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      resident: "Maria Garcia",
      type: "emergency",
      message: "Emergency alert from Room 101",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      resident: "Maria Garcia",
      type: "emergency",
      message: "Emergency alert from Room 102",
      time: "3 min ago",
      read: false,
    },
    {
      id: 3,
      resident: "Maria Garcia",
      type: "emergency",
      message: "Emergency alert from Room 103",
      time: "4 min ago",
      read: false,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notifications-container")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const monthlyData = [
    { month: "Jan", residents: 65 },
    { month: "Feb", residents: 72 },
    { month: "Mar", residents: 85 },
    { month: "Apr", residents: 78 },
    { month: "May", residents: 90 },
    { month: "Jun", residents: 95 },
    { month: "Jul", residents: 90 },
    { month: "Aug", residents: 80 },
    { month: "Sep", residents: 50 },
    { month: "Oct", residents: 40 },
    { month: "Nov", residents: 40 },
    { month: "Dec", residents: 40 },
  ];

  // Sample resident history data
  const residentHistory = [
    {
      id: 1,
      date: "2024-01-18",
      name: "Maria Garcia",
      action: "admitted",
      room: "101",
      type: "admission",
      details: "New resident admission",
      time: "09:30 AM",
    },
    {
      id: 2,
      date: "2024-01-17",
      name: "John Smith",
      action: "admitted",
      room: "205",
      type: "discharge",
      details: "Completed rehabilitation program",
      time: "02:15 PM",
    },
    {
      id: 3,
      date: "2024-01-17",
      name: "Robert Wilson",
      action: "admitted",
      room: "303",
      type: "transfer",
      details: "Internal room transfer",
      time: "11:45 AM",
    },
  ];

  // Sample alert history data
  const alertHistory = [
    {
      id: 1,
      date: "2024-01-18",
      type: "emergency",
      description: "Medical emergency",
      time: "10:15 AM",
      resident: "John Doe",
      room: "101",
    },
    {
      id: 2,
      date: "2024-01-18",
      type: "medication",
      description: "Missed medication schedule",
      time: "09:30 AM",
      resident: "Maria Garcia",
      room: "202",
    },
    {
      id: 3,
      date: "2024-01-17",
      type: "facility",
      description: "Maintenance required in common area",
      time: "03:45 PM",
      resident: "Robert Wilson",
      room: "303",
    },
  ];

  const getActionIcon = (action) => {
    switch (action) {
      case "admitted":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
    }
  };

  const ResidentHistoryModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden m-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Resident History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track all resident-related activities
            </p>
          </div>
          <button
            onClick={() => setShowResidentHistory(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search history..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Date</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {residentHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      {getActionIcon(item.action)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.details} - Room {item.room}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.date}
                    </p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AlertHistoryModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden m-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Alert History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage facility alerts
            </p>
          </div>
          <button
            onClick={() => setShowAlertHistory(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Filters and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Date</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Alert List */}
          <div className="space-y-4">
            {alertHistory.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {alert.resident} - Room {alert.room}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.date}
                    </p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar activePage="dashboard" />

      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl p-4 rounded-xl shadow-sm border border-white/20">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Notification Bell with Dropdown */}
            <div className="relative notifications-container">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-white/80 rounded-lg"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-white">
                  {notifications.filter((n) => !n.read).length}
                </span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Mark all as read
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          !notification.read ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-xl ${
                              notification.type === "emergency"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.resident}
                            </p>
                            <p className="text-sm text-gray-600">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate("/notifications")}
                      className="w-full px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/view-profile")}
              className="flex items-center gap-3 p-1 rounded-lg hover:bg-white/80 transition-colors"
            >
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your facility today
          </p>
        </div>

        {/* Interactive Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Residents Card */}
          <button
            onClick={() => setShowResidentHistory(true)}
            className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  +5.4%
                </span>
                <ArrowUpRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-white/80">
                Total Residents
              </h3>
              <div className="text-3xl font-bold text-white">95</div>
              <p className="text-xs text-white/70">View complete history</p>
            </div>
          </button>

          {/* Active Alerts Card */}
          <button
            onClick={() => setShowAlertHistory(true)}
            className="rounded-xl bg-gradient-to-br from-red-500 to-pink-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  3 urgent
                </span>
                <ArrowUpRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-white/80">
                Active Alerts
              </h3>
              <div className="text-3xl font-bold text-white">12</div>
              <p className="text-xs text-white/70">View all alerts</p>
            </div>
          </button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-lg">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Resident Statistics
                </h3>
                <select className="px-3 py-1.5 bg-white/80 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 12 months</option>
                  <option>Last 6 months</option>
                  <option>Last 3 months</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.9)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="residents"
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showResidentHistory && <ResidentHistoryModal />}
        {showAlertHistory && <AlertHistoryModal />}
      </div>
    </div>
  );
};

export default Dashboard;

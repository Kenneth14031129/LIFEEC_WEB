import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Layout,
  UserPlus,
  Users,
  LogOut,
  MessageCircle,
  Archive,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = ({ activePage = "dashboard", onToggle }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.userType?.toLowerCase();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const getMenuItems = () => {
    const baseMenuItems = [
      { icon: Layout, label: "Dashboard", route: "/dashboard" },
      { icon: UserPlus, label: "Add User", route: "/add-user" },
      { icon: Users, label: "Residents List", route: "/residents-list" },
      { icon: Archive, label: "Archive", route: "/archive" },
    ];

    if (userType === "admin") {
      baseMenuItems.splice(3, 0, {
        icon: UserPlus,
        label: "Add Resident",
        route: "/add-resident",
      });
      baseMenuItems.splice(4, 0, {
        icon: MessageCircle,
        label: "Messages",
        route: "/messages",
      });
    }

    return baseMenuItems;
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    const sidebarState = localStorage.getItem("sidebarCollapsed");
    localStorage.clear();
    localStorage.setItem("sidebarCollapsed", sidebarState);
    navigate("/login");
  };

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));

    // Dispatch custom event for same-window updates
    window.dispatchEvent(
      new CustomEvent("sidebarStateChange", {
        detail: { isCollapsed: newState },
      })
    );

    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-24" : "w-72"}
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl
        font-poppins flex flex-col`}
    >
      <div className="relative p-6">
        <button
          onClick={handleCollapse}
          className="absolute -right-3 top-8 bg-cyan-500 rounded-full p-1 hover:bg-cyan-600 transition-colors"
        >
          <ChevronRight
            className={`h-4 w-4 text-white transform transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`flex items-center gap-3 mb-12 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="min-w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">LE</span>
          </div>
          {!isCollapsed && (
            <span className="text-2xl font-bold text-white tracking-wide">
              LIFEEC
            </span>
          )}
        </div>

        <nav className="space-y-2">
          {!isCollapsed && (
            <div className="px-3 mb-6 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Main Menu
            </div>
          )}
          {menuItems.map(({ icon: Icon, label, route }) => {
            const isActive =
              activePage === label.toLowerCase().replace(" ", "-");
            return (
              <button
                key={label}
                onClick={() => navigate(route)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md hover:shadow-lg transform hover:scale-102"
                      : "text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400"
                  }`}
                title={isCollapsed ? label : undefined}
              >
                <Icon
                  className={`min-w-6 h-6 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-gray-300 group-hover:text-cyan-400"
                  }`}
                />
                {!isCollapsed && (
                  <span className="transition-colors whitespace-nowrap">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className={`mt-auto mb-8 mx-6 flex items-center gap-3 px-4 py-3.5 
          ${isCollapsed ? "justify-center" : ""}
          text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all
          border border-transparent hover:border-red-500/20`}
      >
        <LogOut className="min-w-6 h-6" />
        {!isCollapsed && <span>Log Out</span>}
      </button>
    </div>
  );
};

Sidebar.propTypes = {
  activePage: PropTypes.string,
  onToggle: PropTypes.func,
};

export default Sidebar;

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Layout,
  UserPlus,
  Users,
  LogOut,
  MessageCircle,
  Archive,
} from "lucide-react";

const Sidebar = ({ activePage = "dashboard" }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.userType?.toLowerCase();

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseMenuItems = [
      { icon: Layout, label: "Dashboard", route: "/dashboard" },
      { icon: UserPlus, label: "Add User", route: "/add-user" },
      { icon: Users, label: "Residents List", route: "/residents-list" },
      { icon: Archive, label: "Archive", route: "/archive" },
    ];

    // Add "Add Resident" only for admin
    if (userType === "admin") {
      baseMenuItems.splice(3, 0, {
        icon: UserPlus,
        label: "Add Resident",
        route: "/add-resident",
      });
    }

    // Add Messages menu item only for admin
    if (userType === "admin") {
      baseMenuItems.splice(4, 0, {
        icon: MessageCircle,
        label: "Messages",
        route: "/messages",
      });
    }

    return baseMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg font-poppins">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">LE</span>
          </div>
          <span className="text-2xl font-bold text-white">LIFEEC</span>
        </div>

        <nav className="space-y-1.5">
          <div className="px-3 mb-4 text-xs font-semibold text-gray-400 uppercase">
            Main Menu
          </div>
          {menuItems.map(({ icon: Icon, label, route }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors group
                ${
                  activePage === label.toLowerCase().replace(" ", "-")
                    ? "text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  activePage !== label.toLowerCase().replace(" ", "-") &&
                  "group-hover:text-cyan-400"
                } transition-colors`}
              />
              <span
                className={`${
                  activePage !== label.toLowerCase().replace(" ", "-") &&
                  "group-hover:text-cyan-400"
                } transition-colors`}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <button
        onClick={() => {
          localStorage.clear(); // Clear all localStorage data
          navigate("/login");
        }}
        className="absolute bottom-8 left-6 right-6 flex items-center gap-3 px-4 py-3.5 text-gray-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
      >
        <LogOut className="h-5 w-5" />
        <span>Log Out</span>
      </button>
    </div>
  );
};

Sidebar.propTypes = {
  activePage: PropTypes.string,
};

export default Sidebar;

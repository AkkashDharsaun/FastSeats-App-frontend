import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./Logout";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: "🏠", link: "/dashboard" },
    { name: "Seats", icon: "🎓", link: "/dashboard/seats" },
    { name: "Courses", icon: "📚", link: "/dashboard/courses" },
    { name: "Notifications", icon: "🔔", link: "/dashboard/notifications" },
    { name: "Help & Support", icon: "❓", link: "/dashboard/help" },
    { name: "Settings", icon: "⚙️", link: "/dashboard/settings" },
    { name: "Logout", icon: "🚪" },
  ];

  const handleClick = (item) => {
    setIsOpen(false);

    if (item.name === "Logout") {
      setShowLogout(true); // 🔥 open modal
    } else {
      navigate(item.link);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("college");
    sessionStorage.removeItem("paymentDone");
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Sidebar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-1 rounded-md bg-gray-800 text-white"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-900 text-white
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-center bg-gray-800">
          <h1 className="text-2xl font-bold">MyApp</h1>
        </div>

        <nav className="px-4 py-6 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              className="w-full flex items-center px-5 py-3 text-gray-300
                         hover:bg-gray-800 hover:text-white rounded-md transition"
            >
              <span className="mr-4 text-xl">{item.icon}</span>
              <span className="text-lg">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 🔥 Logout Modal */}
      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar;

import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { IoHome } from "react-icons/io5";
const Sidebar = () => {
  const navItems = [
    { path: "/", icon: assets.home_icon, label: "Home" }, 
    { path: "/add", icon: assets.add_icon, label: "Add Items" },
    { path: "/list", icon: assets.parcel_icon, label: "List Items" },
    { path: "/orders", icon: assets.order_icon, label: "View Orders" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-full md:w-[18%] h-screen bg-[#fffdf8] border-r border-[#f5e4c3] shadow-sm">
        <div className="p-4 pt-8 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[#6b4c3b] mb-2 pl-2">
            Admin Panel
          </h2>

          {navItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "bg-[#fef6e9] text-[#6b4c3b] font-medium border border-[#e9d6ad] shadow-sm"
                    : "text-[#6b4c3b] hover:bg-[#fcf2de] border border-transparent"
                }`
              }
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5e4c3] group-hover:bg-[#e6cc9c] transition">
                <img src={item.icon} alt={item.label} className="w-5 h-5" />
              </div>
              <p className="text-sm tracking-wide">{item.label}</p>
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#fffdf8] border-t border-[#f5e4c3] shadow-inner">
        <div className="flex justify-around py-2">
          {navItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-xs ${
                  isActive ? "text-[#6b4c3b] font-semibold" : "text-gray-500"
                }`
              }
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-6 h-6 mb-1"
              />

            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

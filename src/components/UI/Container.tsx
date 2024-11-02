'use client'
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react"; // Importing Lucide icons

export default function Container({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="container mx-auto max-w-7xl pt-16 px-6 flex-grow relative">
      {/* Sidebar Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-full bg-blue-600 text-white shadow-md focus:outline-none"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="my-3 flex w-full gap-12">
        {/* Sidebar Overlay (only shown on mobile) */}
        <div
          className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-10 transition-opacity ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } lg:hidden`}
          onClick={toggleSidebar} // Close sidebar when clicking outside
        ></div>

        {/* Sidebar Content */}
        <div
          className={`fixed top-0 left-0 h-full bg-white w-3/4 max-w-xs z-20 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-2/5 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-4/5">{children}</div>
      </div>
    </div>
  );
}


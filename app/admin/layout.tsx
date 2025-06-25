"use client"
import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import Footer from "../components/Footer";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar  
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className={`
        flex flex-col flex-grow transition-all duration-300
        `}>
        <main className="flex-grow p-8">
          {children}
        </main>
      <Footer />
      </div>
    </div>
  );
};
export default AdminLayout;

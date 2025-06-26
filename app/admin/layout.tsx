"use client"
import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import Footer from "../components/Footer";
import ToastNotification from "../components/ui/ToastNotification";
import { ToastProvider } from "./ToastContext";

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  isVisible: boolean
}

export type ShowToastFunction = (message: string, type: 'success' | 'error' | 'info') => void;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false,
  })

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
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
          <ToastProvider showToast={showToast}>
            {children}
          </ToastProvider>
        </main>
      <Footer />
      </div>
      {toast.isVisible && (
        <ToastNotification 
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={3000}
        />
      )}
    </div>
  );
};
export default AdminLayout;

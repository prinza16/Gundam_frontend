import Link from "next/link"
import React from "react"
import { FaAngleLeft, FaAngleRight, FaGraduationCap, FaTachometerAlt } from "react-icons/fa"
import { FaFilm, FaGlobe, FaIndustry, FaPersonMilitaryRifle, FaRobot, FaShapes, FaStar } from "react-icons/fa6"

interface AdminSidebarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <aside className={`
      bg-blue-950 text-blue-200 p-4 flex flex-col transition-all duration-300
      ${isSidebarOpen ? 'w-64' : 'w-16 items-center'}
      `}>
      <div className={`
        flex justify-between items-center mb-8
        ${!isSidebarOpen && 'justify-center'}
        `}>
          {isSidebarOpen && (
            <div className="text-2xl font-bold">Admin Panel</div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-gray-600"
          >
            {isSidebarOpen ? <FaAngleLeft size={20}/> : <FaAngleRight size={20} />}
          </button>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <Link href="/admin" className="flex items-center py-2 px-4 rounded hover:bg-blue-800 transition duration-200 ease-in-out">
              <FaTachometerAlt className={isSidebarOpen ? "mr-3" : "mr-0"} size={20} />
              {isSidebarOpen && <span className="whitespace-nowrap">Dashboard</span>} 
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/admin/grade" className="flex items-center py-2 px-4 rounded hover:bg-blue-800 transition duration-200 ease-in-out">
              <FaStar className={isSidebarOpen ? "mr-3" : "mr-0"} size={20} />
              {isSidebarOpen && <span className="whitespace-nowrap">Grade</span>} 
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/admin/universe" className="flex items-center py-2 px-4 rounded hover:bg-blue-800 transition duration-200 ease-in-out">
              <FaGlobe className={isSidebarOpen ? "mr-3" : "mr-0"} size={20} />
              {isSidebarOpen && <span className="whitespace-nowrap">Universe</span>} 
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/admin/series" className="flex items-center py-2 px-4 rounded hover:bg-blue-800 transition duration-200 ease-in-out">
              <FaFilm className={isSidebarOpen ? "mr-3" : "mr-0"} size={20} />
              {isSidebarOpen && <span className="whitespace-nowrap">Series</span>} 
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 px-4 rounded hover:bg-blue-800 transition duration-200 ease-in-out">
              <FaPersonMilitaryRifle className={isSidebarOpen ? "mr-3" : "mr-0"} size={20} />
              {isSidebarOpen && <span className="whitespace-nowrap">Pilot</span>} 
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 px-4 rounded hover:bg-blue-800 transition duration-200 ease-in-out">
              <FaRobot className={isSidebarOpen ? "mr-3" : "mr-0"} size={20} />
              {isSidebarOpen && <span className="whitespace-nowrap">Mobile suit</span>} 
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/admin/type" className="flex items-center py-2 px-4 rounded hover:bg-blue-800 transition duration-200 ease-in-out">
              <FaShapes className={isSidebarOpen ? "mr-3" : "mr-0"} size={20} />
              {isSidebarOpen && <span className="whitespace-nowrap">Type</span>} 
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 px-4 rounded hover:bg-blue-800 transition duration-200 ease-in-out">
              <FaIndustry className={isSidebarOpen ? "mr-3" : "mr-0"} size={20} />
              {isSidebarOpen && <span className="whitespace-nowrap">Vendor</span>} 
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
export default AdminSidebar
"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useToast } from "../ToastContext"
import { PaginatedResponseUniverse, Universe } from "@/types/universe"
import useDebounce from "@/app/hooks/useDebounce"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaChevronLeft,
  FaChevronRight,
  FaGear,
  FaPlus,
  FaTrash,
} from "react-icons/fa6"
import ModalDelete from "@/app/components/ui/ModalDelete"
import EditUniverseModal from "./components/EditUniverseModal"
import CreateUniverseModal from "./components/CreateUniverseModal"
import axiosInstance from "@/app/utils/axios"

const UniverseList: React.FC = () => {
  const showToast = useToast();
  const [universes, setUniverses] = useState<Universe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUniverseId, setSelectedUniverseId] = useState<
    string | number | null
  >(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [universeToDeleteId, setUniverseToDeleteId] = useState<
    string | number | null
  >(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const fetchUniverse = useCallback(
    async (pageToFetch: number = currentPage, currentSearchQuery: string) => {
      setLoading(true)
      setError(null)

      try {
        const params: any = {
          page: pageToFetch,
          limit: itemsPerPage,
        }
        if (currentSearchQuery) {
          params.search = currentSearchQuery
        }

        const response = await axiosInstance.get<PaginatedResponseUniverse>('/universe/', {
          params,
        })

        setUniverses(response.data.results)
        setTotalItems(response.data.count)
        setCurrentPage(pageToFetch)
      } catch (err: any) {
        const message = err.response?.data?.detail || err.message || 'Unknown error occurred'
        showToast(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${message}`, 'error')
      } finally {
        setLoading(false)
      }
    },
    [itemsPerPage, showToast]
  )

  useEffect(() => {
    fetchUniverse(1, debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchUniverse]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handleOpenEditModal = (UniverseId: string | number) => {
    setSelectedUniverseId(UniverseId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUniverseId(null);
    fetchUniverse(currentPage, debouncedSearchQuery);
  };

  const handleOpenDeleteModal = (UniverseId: string | number) => {
    setUniverseToDeleteId(UniverseId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUniverseToDeleteId(null);
  };

  const confirmDeleteUniverse = async () => {
    if (universeToDeleteId === null) return
    setLoading(true)
    setError(null)

    try {
      await axiosInstance.patch(`/universe/${universeToDeleteId}/`, {
        is_active: 0,
      })

      showToast('Delete success!', 'success')

      const currentItemInPage = universes.length
      const newTotalItems = totalItems - 1

      if (newTotalItems === 0) {
        setUniverses([])
        setTotalItems(0)
        setCurrentPage(1)
        setSearchQuery('')
      } else if (currentItemInPage === 1 && currentPage > 1) {
        setCurrentPage((prevPage) => Math.max(1, prevPage - 1))
      } else {
        fetchUniverse(currentPage, debouncedSearchQuery)
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Unknown error'
      setError(message)
      showToast(`เกิดข้อผิดพลาดในการลบ: ${message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      fetchUniverse(pageNumber, debouncedSearchQuery);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600">
        เกิดข้อผิดพลาด: {error}
      </div>
    );
  }

  if (universes.length === 0) {
    return (
      <div className="w-full flex flex-col min-h-[calc(100vh-100px)] bg-gray-900 text-blue-100 p-6 rounded-lg shadow-x">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-200">Universe</h1>
          <div className="flex items-center bg-blue-900">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-blue-200 placeholder-gray-400 border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer shadow-lg shadow-blue-500/50"
          >
            <FaPlus className="mr-2" /> Create
          </button>
        </div>
        <table className="min-w-full table-auto border border-blue-600 shadow-lg shadow-blue-500/50">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                No.
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                Universe Name
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-700">
            <tr className="bg-gray-800 transition duration-300 ease-in-out">
              <td colSpan={3}>
                <div className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                  ไม่พบข้อมูลเกรด
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <CreateUniverseModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onUniverseCreated={() => fetchUniverse(1, "")}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-100px)] bg-gray-900 text-blue-100 p-6 rounded-lg shadow-x">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-200">Universe</h1>
        <div className="flex items-center bg-blue-900">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-blue-200 placeholder-gray-400 border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer shadow-lg shadow-blue-500/50"
        >
          <FaPlus className="mr-2" /> Create
        </button>
      </div>
      {universes.length === 0 ? (
        <div className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
          ไม่พบข้อมูล
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-x-auto">
            <table className="min-w-full table-auto border border-blue-600 shadow-lg shadow-blue-500/50">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                    No.
                  </th>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                    Universe Name
                  </th>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700">
                {universes.map((universe, index) => (
                  <tr
                    key={universe.universe_id}
                    className="bg-gray-800 transition duration-300 ease-in-out"
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                      {universe.universe_name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 flex items-center justify-center">
                      <button
                        onClick={() =>
                          handleOpenEditModal(universe.universe_id)
                        }
                        className="btn inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer shadow-md shadow-cyan-500/50 transition duration-300 ease-in-out"
                      >
                        <FaGear className="mr-2" /> Repair
                      </button>
                      <button
                        className="btn inline-flex items-center bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded cursor-pointer shadow-md shadow-red-500/50 transition duration-300 ease-in-out"
                        onClick={() =>
                          handleOpenDeleteModal(universe.universe_id)
                        }
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-gray-600"></div>
            <div className="flex items-center">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="py-2 px-4 bg-blue-600 text-white cursor-pointer rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                <FaAnglesLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="py-2 px-4 bg-blue-600 text-white cursor-pointer rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                <FaChevronLeft />
              </button>
              <span className="text-blue-200 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="py-2 px-4 bg-blue-600 text-white cursor-pointer rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                <FaChevronRight />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="py-2 px-4 bg-blue-600 text-white cursor-pointer rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </>
      )}

      <CreateUniverseModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onUniverseCreated={() => fetchUniverse(1, "")}
      />
      {selectedUniverseId && (
        <EditUniverseModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          universeId={selectedUniverseId}
          onUniverseUpdated={() =>
            fetchUniverse(currentPage, debouncedSearchQuery)
          }
        />
      )}
      <ModalDelete open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <div className="text-center w-full ">
          <FaTrash size={60} className="mx-auto text-red-600" />
          <div className="mx-auto my-4">
            <h3 className="text-3xl font-black text-blue-100">
              Confirm Delete?
            </h3>
            <p className="text-md text-blue-300">
              Are you sure you want to delete this data?
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="btn btn-danger w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded cursor-pointer"
              onClick={confirmDeleteUniverse}
            >
              Yes
            </button>
            <button
              onClick={handleCloseDeleteModal}
              className="btn btn-cancel w-full bg-gray-700 hover:bg-gray-600 text-blue-200 font-bold py-2 px-4 rounded cursor-pointer"
            >
              Cancal
            </button>
          </div>
        </div>
      </ModalDelete>
    </div>
  );
};
export default UniverseList;

'use client'

import { useCallback, useEffect, useState } from "react"
import { useToast } from "../ToastContext"
import { Mobilesuit, MobilesuitRead, PaginatedResponseMobilesuit, PaginatedResponseMobilesuitRead } from "@/types/mobilesuit"
import useDebounce from "@/app/hooks/useDebounce"
import { FaGears, FaPlus, FaTrash } from "react-icons/fa6"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import ModalDelete from "@/app/components/ui/ModalDelete"
import CreateMobilesuitModal from "./components/CreateMobilesuitModal"

const MobilesuitList = () => {
    const showToast = useToast()
    const [mobilesuits, setMobilesuits] = useState<MobilesuitRead[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMobilesuitsId, setSelectedMobilesuitsId] = useState<
    string | number | null
  >(null)

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [mobilesuitsToDeleteId, setMobilesuitsToDeleteID] = useState<
    string | number | null
  >(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchMobilesuits = useCallback(
    async (pageToFetch: number = currentPage, currentSearchQuery: string) => {
        setLoading(false)
        setError(null)
        try {
            const url = new URL(`http://127.0.0.1:8000/gundam_data/`)
            url.searchParams.append("page", pageToFetch.toString())
            url.searchParams.append("limit", itemsPerPage.toString())
            if (currentSearchQuery) {
                url.searchParams.append("search", currentSearchQuery)
            }

            const response = await fetch(url.toString())
            if (!response.ok) {
                if (response.status === 404 && pageToFetch > 1) {
                    setCurrentPage((prevPage) => Math.max(1, prevPage - 1))
                    return
                }
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data: PaginatedResponseMobilesuitRead = await response.json()
            setMobilesuits(data.results)
            setTotalItems(data.count)
            setCurrentPage(pageToFetch)
        } catch (err) {
            if (err instanceof Error) {
            setError(err.message);
            showToast(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${err.message}`, "error");
            } else {
            setError("An unknown error occurred.");
            showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล", "error");
            }
        } finally {
            setLoading(false)
        }
    },
    [itemsPerPage, showToast]
  )

  useEffect(() => {
    fetchMobilesuits(1, debouncedSearchQuery)
  }, [debouncedSearchQuery, fetchMobilesuits])

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handleOpenDeleteModal = (MobilesulitID: string | number) => {
    setMobilesuitsToDeleteID(MobilesulitID)
    setOpenDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setMobilesuitsToDeleteID(true)
  }

  const confirmDeleteMobilesuit = async () => {
    if (mobilesuitsToDeleteId === null) 
      return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/gundam_data/${mobilesuitsToDeleteId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({ is_active: 0})
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `HTTP error! status: ${response.status}, Details: ${JSON.stringify(
            errorData
          )}`
        )
      }

      showToast("Delete success!", "success")

      const currentItemInPage = mobilesuits.length
      const newTotalItems = totalItems - 1

      if (newTotalItems === 0) {
        setMobilesuits([])
        setTotalItems(0)
        setCurrentPage(1)
        setSearchQuery("")
      } else if (currentItemInPage === 1 && currentPage > 1) {
        setCurrentPage((prevPage) => Math.max(1, prevPage -1))
      } else {
        fetchMobilesuits(currentPage, debouncedSearchQuery)
      }
      handleCloseDeleteModal()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(`เกิดข้อผิดพลาดในการลบ: ${err.message}`, "error")
      } else {
        setError("An unknown error occurred during deletion.")
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการลบข้อมูล", "error")
      }
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  if (mobilesuits.length === 0) {
    return (
      <div className="w-full flex flex-col min-h-[calc(100vh-100px)] bg-gray-900 text-blue-100 p-6 rounded-lg shadow-x">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-200">Seller</h1>
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
                Mobilesuit Name
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                Grade Name
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                Seller Name
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                Type Name
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                Box size
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                Image
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                Date release
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-700">
            <tr className="bg-gray-800 transition duration-300 ease-in-out">
              <td colSpan={9}>
                <div className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                  ไม่พบข้อมูลโมบิลสูท
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <CreateMobilesuitModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onMobilesuitCreated={() => fetchMobilesuits(1, "")}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-100px)] bg-gray-900 text-blue-100 p-6 rounded-lg shadow-x">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-200">Seller</h1>
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
      {mobilesuits.length === 0 ? (
        <div className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
          ไม่พบข้อมูล
        </div>
      ) : (
        <div className="flex-grow overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                            No.
                        </th>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                            Mobilesuit Name
                        </th>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                            Grade Name
                        </th>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                            Seller Name
                        </th>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                            Type Name
                        </th>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                            Box size
                        </th>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                            Image
                        </th>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                            Date release
                        </th>
                        <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600"></th>
                    </tr>
                </thead>
                <tbody>
                    {mobilesuits.map((mobilesuit, index) => (
                        <tr key={mobilesuit.model_id}>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                                {index + 1}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                                {mobilesuit.model_name}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                                {mobilesuit.model_grade_name}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                                {mobilesuit.model_seller_name}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                                {mobilesuit.model_type_name}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                                {mobilesuit.model_width}ซม. x {mobilesuit.model_length}ซม. x {mobilesuit.model_height} ซม.
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                                {mobilesuit.main_image ? (
                                    <img 
                                        src={mobilesuit.main_image}
                                        alt={mobilesuit.main_image}
                                        className="h-16 w-16 object-cover rounded-md mx-auto"
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                                {mobilesuit.release_date}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 flex items-center justify-center">
                            <button className="btn inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer shadow-md shadow-cyan-500/50 transition duration-300 ease-in-out">
                                <FaGears className="mr-2" /> Repair
                            </button>
                            <button
                                className="btn inline-flex items-center bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded cursor-pointer shadow-md shadow-red-500/50 transition duration-300 ease-in-out"
                                onClick={() => handleOpenDeleteModal(mobilesuit.model_id)}
                            >
                                <FaTrash className="mr-2" /> Delete
                            </button>
                            </td>
                                </tr>
                            ))}
                </tbody>
            </table>
        </div>
      )}
      <CreateMobilesuitModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onMobilesuitCreated={() => fetchMobilesuits(1, "")}
        />
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
              onClick={confirmDeleteMobilesuit}
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
  )
}
export default MobilesuitList
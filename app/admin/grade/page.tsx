'use client'

import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import { Grade } from "@/types/grade"
import { useEffect, useState } from "react"
import CreateGradeModal from "./components/CreateGradeModal"
import EditGradeModal from "./components/EditGradeModal"
import ModalDelete from "@/app/components/ui/ModalDelete"
import { FaGear, FaPlus, FaTrash } from "react-icons/fa6"
import { useToast } from "@/app/admin/ToastContext";

const GradeList: React.FC = () => {
  const showToast = useToast();
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedGradeId, setSelectedGradeId] = useState<string | number | null>(null)

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [gradeToDeleteId, setGradeToDeleteId] = useState<string | number | null>(null)

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/grade/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Grade[] = await response.json();
      setGrades(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${err.message}`, 'error');
      } else {
        setError("An unknown error occurred.");
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [showToast]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (gradeId: string | number) => {
    setSelectedGradeId(gradeId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedGradeId(null);
  };

  const handleOpenDeleteModal = (gradeId: string | number) => {
    setGradeToDeleteId(gradeId);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setGradeToDeleteId(null);
  };

  const confirmDeleteGrade = async () => {
    if (gradeToDeleteId === null) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/grade/${gradeToDeleteId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: 0 })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      }

      showToast('ลบข้อมูลเกรดเรียบร้อยแล้ว!', 'success');
      fetchGrades();
      handleCloseDeleteModal();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(`เกิดข้อผิดพลาดในการลบ: ${err.message}`, 'error');
      } else {
        setError("An unknown error occurred during deletion.");
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการลบข้อมูล", 'error');
      }
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600">
        เกิดข้อผิดพลาด: {error}
      </div>
    )
  }

  if(grades.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-500">ไม่พบข้อมูลเกรด</div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Grade</h1>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
        >
         <FaPlus className="mr-2" /> Create
        </button>
      </div>
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-blue-600 shadow-lg shadow-blue-500/50">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-white tracking-wider border-b border-blue-600">No.</th>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-white tracking-wider border-b border-blue-600">Grade Name</th>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-200 tracking-wider border-b border-blue-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700">
                {grades.map((grade, index) => (
                  <tr key={grade.grade_id} className="bg-gray-800 hover:bg-gray-700 transition duration-300 ease-in-out">
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-green-400 text-center">{index + 1}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-green-400 text-center">{grade.grade_name}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-green-400 flex items-center justify-center">
                      <button onClick={() => handleOpenEditModal(grade.grade_id)} className="btn inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer">
                        <FaGear className="mr-2" /> Repair
                      </button>
                      <button 
                        className="btn inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={() => handleOpenDeleteModal(grade.grade_id)}
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <CreateGradeModal 
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onGradeCreated={fetchGrades}
        />
        {selectedGradeId && (
          <EditGradeModal 
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            gradeId={selectedGradeId}
            onGradeUpdated={fetchGrades}
          />
        )}
        <ModalDelete open={openDeleteModal} onClose={handleCloseDeleteModal}>
          <div className="text-center w-full">
            <FaTrash size={60} className="mx-auto text-red-500" />
            <div className="mx-auto my-4">
              <h3 className="text-3xl font-black text-gray-800">Confirm Delete?</h3>
              <p className="text-md text-gray-500">Are you sure you want to delete this data?</p>
            </div>
            <div className="flex gap-4">
              <button 
                className="btn btn-danger w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={confirmDeleteGrade}
              >
                Yes
              </button>
              <button 
                onClick={handleCloseDeleteModal} 
                className="btn btn-cancel w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer"
              >
                Cancal
              </button>
            </div>
          </div>
        </ModalDelete>
    </div>
  )
}
export default GradeList
"use client";

import Modal from "@/app/components/ui/Modal";
import { Grade } from "@/types/grade";
import React, { useEffect, useState } from "react";
import { useToast } from "@/app/admin/ToastContext";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

interface EditGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeId: string | number;
  onGradeUpdated: () => void;
}

const EditGradeModal: React.FC<EditGradeModalProps> = ({
  isOpen,
  onClose,
  gradeId,
  onGradeUpdated
}) => {
  const showToast = useToast();
  const [formData, setFormData] = useState({ grade_name: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !gradeId) {
      setLoading(false);
      return;
    }

    const fetchGradeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/grade/${gradeId}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Grade = await response.json();
        setFormData({ grade_name: data.grade_name });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          showToast(`เกิดข้อผิดพลาดในการดึงข้อมูลเกรด: ${err.message}`, 'error');
        } else {
          setError("An unknown error occurred.");
          showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูลเกรด", 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGradeDetail();
  }, [isOpen, gradeId, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/grade/${gradeId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grade_name: formData.grade_name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, Details: ${JSON.stringify(
            errorData
          )}`
        );
      }

      showToast("ชื่อเกรดถูกแก้ไขเรียบร้อยแล้ว!", "success");
      onGradeUpdated();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(`เกิดข้อผิดพลาดในการแก้ไข: ${err.message}`, 'error');
      } else {
        setError("An unknown error occurred during update.");
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการแก้ไขข้อมูล", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="กำลังโหลดข้อมูลเกรด...">
        <LoadingSpinner />
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`แก้ไขข้อมูลเกรด: ${formData.grade_name}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="gradeName" className="block text-gray-700 text-sm font-bold mb-2">
            ชื่อเกรด:
          </label>
          <input
            type="text"
            id="gradeName"
            name="grade_name"
            value={formData.grade_name}
            onChange={handleInputChange}
            placeholder="กรุณากรอกชื่อเกรด"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
         <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out"
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            disabled={loading}
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default EditGradeModal;

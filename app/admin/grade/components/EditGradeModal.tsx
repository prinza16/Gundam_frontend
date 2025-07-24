"use client";

import Modal from "@/app/components/ui/Modal";
import { Grade } from "@/types/grade";
import React, { useEffect, useState } from "react";
import { useToast } from "@/app/admin/ToastContext";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Input from "@/app/components/ui/Input";
import axiosInstance from "@/app/utils/axios";
import { BiMessageSquare } from "react-icons/bi";
import axios from "axios";
import { maxLength, required, validateForm } from "@/app/utils/validation";

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
      setLoading(true)
      setError(null)

      try {
        const response = await axiosInstance.get<Grade>(`/grade/${gradeId}/`)
        setFormData({ grade_name: response.data.grade_name })
      } catch (err: any) {
        const message = err.response?.data?.detail || err.message || "Unknown error"
        setError(message)
        showToast(`เกิดข้อผิดพลาดในการดึงข้อมูลเกรด: ${message}`, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchGradeDetail();
  }, [isOpen, gradeId, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, grade_name: e.target.value}))
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const rules = {
      grade_name: [
        required("ชื่อเกรด"),
        maxLength(10, "ชื่อเกรด")
      ]
    }

    const errors = validateForm(formData, rules)

    if (errors.grade_name) {
      setError(errors.grade_name)
      return
    }

    try {
      await axiosInstance.patch(`/grade/${gradeId}/`, {
        grade_name: formData.grade_name.trim()
      })

      showToast("Success!", "success")
      onGradeUpdated()
      onClose()
    } catch (err: any) {
      console.error("EditGradeModal error:", err)

      if (axios.isAxiosError(err)) {
        const data = err.response?.data

        if (data && typeof data === "object") {
          const messages = Object.values(data).flat().join(" ")
          setError(messages)
          showToast(messages, "error")
        } else if (err.response?.status === 500) {
          const msg = "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่ภายหลัง"
          setError(msg)
          showToast(msg, "error")
        } else {
          const msg = "ไม่สามารถส่งข้อมูลได้ กรุณาตรวจสอบอีกครั้ง"
          setError(msg)
          showToast(msg, "error")
        }
      } else {
        const fallbackMessage = err.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
        setError(fallbackMessage)
        showToast(fallbackMessage, "error")
      }
    } finally {
      setLoading(false)
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
      title={`Edit Data`}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input 
            label="Grade Name"
            type="text"
            id="gradeName"
            value={formData.grade_name}
            onChange={handleInputChange}
            error={error}
          />
        </div>
         <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default EditGradeModal;

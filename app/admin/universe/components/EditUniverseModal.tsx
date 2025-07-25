"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../ToastContext";
import { Universe } from "@/types/universe";
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import axiosInstance from "@/app/utils/axios";
import { maxLength, required, validateForm } from "@/app/utils/validation";
import axios from "axios";

interface EditUniverseModalProps {
  isOpen: boolean
  onClose: () => void
  universeId: string | number
  onUniverseUpdated: () => void
}

const EditUniverseModal: React.FC<EditUniverseModalProps> = ({
  isOpen,
  onClose,
  universeId,
  onUniverseUpdated,
}) => {
  const showToast = useToast()
  const [formData, setFormData] = useState({ 
    universe_name: "" 
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !universeId) {
      setLoading(false)
      return
    }

    const fetchUniverseDetail = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await axiosInstance.get<Universe>(`/universe/${universeId}/`)
        setFormData({ universe_name: response.data.universe_name })
      } catch (err: any) {
        const message = err.response?.data?.detail || err.message || "Unknown error"
        setError(message)
        showToast(`เกิดข้อผิดพลาดในการดึงข้อมูลเกรด: ${message}`, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchUniverseDetail()
  }, [isOpen, universeId, showToast])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, universe_name: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const rules = {
      universe_name: [
        required("ชื่อจักรวาล"),
        maxLength(100, "ชื่อจักรวาล")
      ]
    }

    const errors = validateForm(formData, rules)

    if (errors.universe_name) {
      setError(errors.universe_name)
      return
    }

    try {
      await axiosInstance.patch(`/universe/${universeId}/`, {
        universe_name: formData.universe_name.trim()
      })

      showToast("Success!", "success")
      onUniverseUpdated()
      onClose()
    } catch (err: any) {
      console.error("EditUniverseModal error:", err)

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

  }

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="กำลังโหลดข้อมูลเกรด...">
        <LoadingSpinner />
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Data`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Universe Name"
            type="text"
            id="universeName"
            value={formData.universe_name}
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
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default EditUniverseModal;

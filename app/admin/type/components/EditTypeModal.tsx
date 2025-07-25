"use client"

import { useEffect, useState } from "react"
import { useToast } from "../../ToastContext"
import { Type } from "@/types/type"
import Modal from "@/app/components/ui/Modal"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import Input from "@/app/components/ui/Input"
import axiosInstance from "@/app/utils/axios"
import { maxLength, required, validateForm } from "@/app/utils/validation"
import axios from "axios"

interface EditTypeModalProps {
  isOpen: boolean
  onClose: () => void
  typeId: string | number
  onTypeUpdated: () => void
}

const EditTypeModal: React.FC<EditTypeModalProps> = ({
  isOpen,
  onClose,
  typeId,
  onTypeUpdated,
}) => {
  const showToast = useToast()
  const [formData, setFormData] = useState({
    types_name: ""
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !typeId) {
      setLoading(false)
      return
    }

    const fetchTypeDetail = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await axiosInstance.get<Type>(`/gundam_data/types/${typeId}/`)
        setFormData({ types_name: response.data.types_name })
      } catch (err: any) {
        const message = err.response?.data?.detail || err.message || "Unknown error"
        setError(message)
        showToast(`เกิดข้อผิดพลาดในการดึงข้อมูลเกรด: ${message}`, 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchTypeDetail()
  }, [isOpen, typeId, showToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, types_name: e.target.value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const rules = {
      types_name: [
        required("ชื่อชนิด"),
        maxLength(100, "ชื่อชนิด")
      ]
    }

    const errors = validateForm(formData, rules)

    if (errors.types_name) {
      setError(errors.types_name)
      return
    }

    try {
      await axiosInstance.patch(`/gundam_data/types/${typeId}/`, {
        types_name: formData.types_name.trim()
      })

      showToast("Success!", "success")
      onTypeUpdated()
      onClose()
    } catch (err: any) {
      console.error("EditTypeModal error:", err)

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
            label="Type Name"
            type="text"
            id="typeName"
            value={formData.types_name}
            onChange={handleInputChange}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
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
  )
}
export default EditTypeModal
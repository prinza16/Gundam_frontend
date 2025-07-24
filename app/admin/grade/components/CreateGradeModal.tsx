'use client'

import Modal from "@/app/components/ui/Modal"
import React, { useEffect, useState } from "react"
import { useToast } from "@/app/admin/ToastContext";
import Input from "@/app/components/ui/Input";
import axiosInstance from "@/app/utils/axios";
import axios from "axios";
import { required, maxLength, validateForm } from "@/app/utils/validation";

interface CreateGradeModalProps {
  isOpen: boolean
  onClose: () => void
  onGradeCreated: () => void
}

const CreateGradeModal: React.FC<CreateGradeModalProps> = ({ isOpen, onClose, onGradeCreated }) => {
  const showToast = useToast();
  const [gradeName, setGradeName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setGradeName('')
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const formData = { gradeName }

    const rules = {
      gradeName: [
        required("ชื่อเกรด"),
        maxLength(10, "ชื่อเกรด")
      ]
    }

    const errors = validateForm(formData, rules)

    if (errors.gradeName) {
      setError(errors.gradeName)
      return
    }

    setLoading(true)

    try {
       await axiosInstance.post("/grade/", {
        grade_name: gradeName.trim(),
       })

       showToast('Success!', 'success')
       onGradeCreated()
       onClose()
       setGradeName('')
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data

        if (data && typeof data === "object") {
          const messages = Object.values(data).flat().join(" ")

          setError(messages)
          showToast(messages, "error")
        } else if (err.response?.status === 500) {
          setError("เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่ภายหลัง")
          showToast("ระบบขัดข้อง กรุณาลองใหม่", "error")
        } else {
          setError("ไม่สามารถส่งข้อมูลได้ กรุณาตรวจสอบอีกครั้ง")
          showToast("ไม่สามารถส่งข้อมูลได้", "error")
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Data" >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Grade Name" 
              type="text" 
              id="gradeName" 
              value={gradeName} 
              onChange={(e) => setGradeName(e.target.value)} 
              error={error}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-blue-200 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer shadow-md shadow-cyan-500/50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default CreateGradeModal
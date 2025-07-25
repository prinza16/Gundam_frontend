'use client'

import React, { useState } from "react"
import { useToast } from "../../ToastContext"
import Modal from "@/app/components/ui/Modal"
import Input from "@/app/components/ui/Input"
import { maxLength, required, validateForm } from "@/app/utils/validation"
import axios from "axios"
import axiosInstance from "@/app/utils/axios"

interface CreateTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onTypeCreated: () => void
}

const CreateTypeModal: React.FC<CreateTypeModalProps> = ({
    isOpen,
    onClose,
    onTypeCreated
  }) => {
    const showToast = useToast()
    const [typeName, setTypeName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      const formData = { typeName }

      const rules = {
        typeName: [
          required("ชื่อชนิด"),
          maxLength(100, "ชื่อชนิด")
        ]
      }

      const errors = validateForm(formData, rules)

      if (errors.typeName) {
        setError(errors.typeName)
        return
      }

      setLoading(true)

      try {
        await axiosInstance.post(`/gundam_data/types/`, {
          types_name: typeName.trim(),
        })

        showToast('Success!', 'success')
        onTypeCreated()
        onClose()
        setTypeName('')
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
      <Modal isOpen={isOpen} onClose={onClose} title="Create Data">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input 
              label="Type Name"
              type="text"
              id="typeName"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
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
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
export default CreateTypeModal
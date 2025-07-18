'use client'

import Modal from "@/app/components/ui/Modal"
import React, { useState } from "react"
import { useToast } from "@/app/admin/ToastContext";
import Input from "@/app/components/ui/Input";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://127.0.0.1:8000/grade/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade_name: gradeName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, Details: ${JSON.stringify(errorData)}`)
      }

      await response.json()

      showToast('Success!', 'success')

      onGradeCreated()
      onClose() 
      setGradeName('')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        showToast(`เกิดข้อผิดพลาด: ${err.message}`, 'error')
      } else {
        setError("An unknown error occurred during creation.")
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการสร้างเกรด", 'error')
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
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
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
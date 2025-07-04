"use client"

import React, { useEffect, useState } from "react"
import { useToast } from "../../ToastContext"
import { Series } from "@/types/series"
import Modal from "@/app/components/ui/Modal"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import Input from "@/app/components/ui/Input"

interface EditSeriesModalProps {
  isOpen: boolean
  onClose: () => void
  seriesId: string | number 
  onSeriesUpdated: () => void
}

const EditSeriesModal: React.FC<EditSeriesModalProps> = ({
  isOpen,
  onClose,
  seriesId,
  onSeriesUpdated,
}) => {
  const showToast = useToast()
  const [formData, setFormData] = useState({ 
    series_name: ""
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !seriesId) {
      setLoading(false)
      return
    }

    const fetchSeriesDetail = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/series/${seriesId}/`
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Series = await response.json()
        setFormData({ series_name: data.series_name })
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
          showToast(
            `เกิดข้อผิดพลาดในการดึงข้อมูลเกรด: ${err.message}`,
            "error"
          )
        } else {
          setError("An unknown error occurred.")
          showToast(
            "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูลเกรด",
            "error"
          )
        }
      } finally {
        setLoading(false)
      }
    }
    fetchSeriesDetail()
  }, [isOpen, seriesId, showToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, series_name: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://127.0.0.1:8000/series/${seriesId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ series_name: formData.series_name }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `HTTP error! status: ${response.status}, Details: ${JSON.stringify(
            errorData
          )}`
        )
      }

      showToast("Success!", "success")
      onSeriesUpdated()
      onClose()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        showToast(`เกิดข้อผิดพลาดในการแก้ไข: ${err.message}`, 'error')
      } else {
        setError("An unknown error occurred during update.")
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการแก้ไขข้อมูล", 'error')
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
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Data`} >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input 
            label="Series Name"
            type="text"
            id="seriesName"
            value={formData.series_name}
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
export default EditSeriesModal
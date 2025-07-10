"use client"

import React, { useEffect, useState } from "react"
import { useToast } from "../../ToastContext"
import { Series } from "@/types/series"
import Modal from "@/app/components/ui/Modal"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import Input from "@/app/components/ui/Input"
import Select from "@/app/components/ui/Select"
import SelectFile from "@/app/components/ui/SelectFile"
import { SelectOption } from "@/types/select"
import { PaginatedResponseUniverse } from "@/types/universe"

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
  const [formData, setFormData] = useState<{
    series_name: string
    series_universe?: number
    series_image?: string
  }>({
    series_name: "",
  })
  const [selectedUniverseId, setSelectedUniverseId] = useState<number | ''>('')
  const [universeOptions, setUniverseOptions] = useState<SelectOption[]>([])
  const [seriesImageFile, setSeriesImageFIle] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingUniverses, setIsLoadingUniverses] = useState(false)

  useEffect(() => {
    if (!seriesImageFile) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(seriesImageFile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [seriesImageFile])

  useEffect(() => {
    if (!isOpen || !seriesId) {
      setLoading(false)
      return
    }

    const fetchUniverses = async () => {
      setIsLoadingUniverses(true)
      try {
        const response = await fetch("http://127.0.0.1:8000/universe/")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: PaginatedResponseUniverse = await response.json()
        const actualOptions: SelectOption[] = data.results.map((universe) => ({
          value: universe.universe_id,
          label: universe.universe_name
        }))

        const placeholderOption: SelectOption = {
          value: '',
          label: " ",
        }

        setUniverseOptions([placeholderOption, ...actualOptions])
      } catch (err) {
      console.error("Error fetching universes:", err);
      if (err instanceof Error) {
        showToast(`เกิดข้อผิดพลาดในการดึงข้อมูล Universe: ${err.message}`, "error");
      } else {
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล Universe", "error");
      }
      } finally {
        setIsLoadingUniverses(false)
      }
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
        setFormData({ 
          series_name: data.series_name, 
          series_universe: data.series_universe, 
          series_image: data.series_image 
        })
        setSelectedUniverseId(data.series_universe || '')
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
    fetchUniverses()
  }, [isOpen, seriesId, showToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, series_name: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("series_name", formData.series_name)
      formDataToSend.append("series_universe", selectedUniverseId.toString())

      if (seriesImageFile) {
        formDataToSend.append("series_image", seriesImageFile)
      }

      const response = await fetch(`http://127.0.0.1:8000/series/${seriesId}/`, {
        method: "PATCH",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! ${response.status}: ${JSON.stringify(errorData)}`)
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
        <div className="mb-4">
          <Select
            label="Universe Name"
            options={universeOptions}
            selectedValue={selectedUniverseId}
            onSelect={setSelectedUniverseId}
            disabled={isLoadingUniverses}
          />
        </div>
        <div className="mb-4">
          <SelectFile 
            label="Series Image"
            id="seriesImage"
            onFileChange={setSeriesImageFIle}
            selectedFileName={
              seriesImageFile?.name || formData.series_image?.split("/").pop() || ""
            }
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
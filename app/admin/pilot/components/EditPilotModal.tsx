"use client"

import React, { useEffect, useState } from "react"
import { useToast } from "../../ToastContext"
import { SelectOption } from "@/types/select"
import { PaginatedResponseUniverse } from "@/types/universe"
import { Pilot } from "@/types/pilot"
import Modal from "@/app/components/ui/Modal"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import Input from "@/app/components/ui/Input"
import Select from "@/app/components/ui/Select"
import SelectFile from "@/app/components/ui/SelectFile"

interface EditPilotModalProps {
  isOpen: boolean
  onClose: () => void
  pilotId: string | number
  onPilotUpdated: () => void
}

const EditPilotModal: React.FC<EditPilotModalProps> = ({
  isOpen,
  onClose,
  pilotId,
  onPilotUpdated,
}) => {
  const showToast = useToast()
  const [formData, setFormData] = useState<{
    pilot_name: string
    pilot_universe?: number
    pilot_images?: string | null
  }>({
    pilot_name: "",
  })

  const fullImageUrl = formData.pilot_images
    ? formData.pilot_images.startsWith('http')
      ? formData.pilot_images
      : `http://127.0.0.1:8000${formData.pilot_images}`
    : undefined

  const [selectedUniverseId, setSelectedUniverseId] = useState<string | number>('')
  const [universeOptions, setUniverseOptions] = useState<SelectOption[]>([])
  const [pilotImageFile, setPilotImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingUniverses, setIsLoadingUniverses] = useState(false)

  useEffect(() => {
    if (!isOpen || !pilotId) {
      setLoading(false)
      return
    }

    const fetchUniverses = async () => {
      setIsLoadingUniverses(true)
      try {
        const response = await fetch("http://127.0.0.1:8000/universe/")
        const data: PaginatedResponseUniverse = await response.json()
        const actualOptions: SelectOption[] = data.results.map((universe) => ({
          value: universe.universe_id,
          label: universe.universe_name
        }))

        setUniverseOptions([{ value: '', label: " "}, ...actualOptions])
      } catch (err) {
        showToast("เกิดข้อผิดพลาดในการดึงข้อมูล Universe", "error")
      } finally {
        setIsLoadingUniverses(false)
      }
    }

    const fetchPilotDetail = async () => {
      setLoading(true)
      try {
        const response = await fetch(`http://127.0.0.1:8000/pilot/${pilotId}`)
        const data: Pilot = await response.json()
        setFormData({
          pilot_name: data.pilot_name,
          pilot_universe: data.pilot_universe,
          pilot_images: data.pilot_images
        })
        setSelectedUniverseId(data.pilot_universe || '')
      } catch (err) {
        showToast("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchPilotDetail()
    fetchUniverses()
  }, [isOpen, pilotId, showToast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, pilot_name: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("pilot_name", formData.pilot_name)
      formDataToSend.append("pilot_universe", selectedUniverseId.toString())

      if (pilotImageFile) {
        formDataToSend.append("pilot_images", pilotImageFile)
      }

      const response = await fetch(`http://127.0.0.1:8000/pilot/${pilotId}/`, {
        method: "PATCH",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! ${response.status}: ${JSON.stringify(errorData)}`)
      }

      showToast("Success!", "success")
      onPilotUpdated()
      onClose()
    } catch (err) {
      showToast("เกิดข้อผิดพลาดในการแก้ไขข้อมูล", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="กำลังโหลดข้อมูล...">
        <LoadingSpinner />
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Data`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input 
            label="Pilot Name"
            type="text"
            id="pilotName"
            value={formData.pilot_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <Select 
            label="Unvierse Name"
            options={universeOptions}
            selectedValue={selectedUniverseId}
            onSelect={setSelectedUniverseId}
            disabled={isLoadingUniverses}
          />
        </div>
        <div className="mb-4">
          <SelectFile 
            label="Pilot Image"
            id="pilotImage"
            onFileChange={setPilotImageFile}
            selectedFileName={
              pilotImageFile?.name || formData.pilot_images?.split("/").pop() || ""
            }
            defaultImageUrl={fullImageUrl}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
export default EditPilotModal
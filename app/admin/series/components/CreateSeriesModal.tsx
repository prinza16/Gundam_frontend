'use client'

import React, { useEffect, useState } from "react"
import { useToast } from "../../ToastContext"
import Modal from "@/app/components/ui/Modal"
import Input from "@/app/components/ui/Input"
import Select from "@/app/components/ui/Select"
import { SelectOption } from "@/types/select"
import { PaginatedResponseUniverse } from "@/types/universe"
import SelectFile from "@/app/components/ui/SelectFile"


interface CreateSeriesModalProps {
  isOpen: boolean
  onClose: () => void
  onSeriesCreated: () => void
}

const CreateSeriesModal: React.FC<CreateSeriesModalProps> = ({
  isOpen,
  onClose,
  onSeriesCreated,
}) => {
  const showToast = useToast()
  const [seriesName, setSeriesName] = useState("")
  const [selectedUniverseId, setSelectedUniverseId] = useState<string | number>('')
  const [universeOptions, setUniverseOptions] = useState<SelectOption[]>([])
  const [seriesImageFile, setSeriesImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingUniverses, setIsLoadingUniverses] = useState(false)

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
      setIsLoadingUniverses(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchUniverses()
      setSeriesName("")
      setSelectedUniverseId('')
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (selectedUniverseId === '') {
      setError("Please Select Universe")
      showToast("Please Select Universe", "error")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("series_name", seriesName)
    formData.append("series_universe", String(selectedUniverseId))
    formData.append("is_active", "true")

    if (seriesImageFile) {
      formData.append("series_image", seriesImageFile)
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/series/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, Details: ${JSON.stringify(
            errorData
          )}`
        );
      }

      await response.json();

      showToast("Success!", "success");

      onSeriesCreated()
      onClose();
      setSeriesName("")
      setSelectedUniverseId('')
      setSeriesImageFile(null)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(`เกิดข้อผิดพลาด: ${err.message}`, `error`);
      } else {
        setError("An unknown error occurred during creation.");
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการสร้างเกรด", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Data">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Series Name"
              type="text"
              id="seriesName"
              value={seriesName}
              onChange={(e) => setSeriesName(e.target.value)}
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
              onFileChange={setSeriesImageFile}
              selectedFileName={seriesImageFile ? seriesImageFile.name : null}
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
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
export default CreateSeriesModal
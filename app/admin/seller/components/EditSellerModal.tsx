"use client"

import React, { use, useEffect, useState } from "react"
import { useToast } from "../../ToastContext"
import { Seller } from "@/types/seller"
import Modal from "@/app/components/ui/Modal"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner"
import Input from "@/app/components/ui/Input"

interface EditSellerModalProps {
    isOpen: boolean
    onClose: () => void
    sellerId: string | number
    onSellerUpdated: () => void
}

const EditSellerModal: React.FC<EditSellerModalProps> = ({
    isOpen,
    onClose,
    sellerId,
    onSellerUpdated
}) => {
    const showToast = useToast()
    const [formData, setFormData] = useState({
        seller_name: ""
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen || !sellerId) {
            setLoading(false)
            return
        }

        const fetchSellerDetail = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/gundam_data/seller/${sellerId}/`
                )
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data: Seller = await response.json()
                setFormData({ seller_name: data.seller_name})
            } catch (err) {
                if (err instanceof Error) {
                setError(err.message)
                showToast(
                    `เกิดข้อผิดพลาดในการดึงข้อมูลเกรด: ${err.message}`,
                    "error"
                );
                } else {
                setError("An unknown error occurred.")
                showToast(
                    "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูลเกรด",
                    "error"
                )};
            } finally {
                setLoading(false)
            }
        }
        fetchSellerDetail()
    }, [isOpen, sellerId, showToast])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, seller_name: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`http://127.0.0.1:8000/gundam_data/seller/${sellerId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ seller_name: formData.seller_name }),
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
            onSellerUpdated()
            onClose()
        } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
          showToast(`เกิดข้อผิดพลาดในการแก้ไข: ${err.message}`, 'error')
        } else {
          setError("An unknown error occurred during update.");
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
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Data`}>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <Input 
                    label="Seller Name"
                    type="text"
                    id="typeName"
                    value={formData.seller_name}
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
export default EditSellerModal
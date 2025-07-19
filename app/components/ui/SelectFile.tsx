'use client'

import { SelectFileInputProps } from "@/types/selectfile"
import React, { useEffect, useState } from "react"


const SelectFile: React.FC<SelectFileInputProps> = ({
    label,
    onFileChange,
    selectedFileName,
    id,
    disabled = false,
    defaultImageUrl,
}) => {
    const [internalFileName, setInternalFileName] = useState<string | null>(selectedFileName || null)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!imagePreviewUrl && defaultImageUrl) {
            setImagePreviewUrl(defaultImageUrl)
        }
    }, [defaultImageUrl, imagePreviewUrl])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null

        if (!file || !file.type.startsWith('image/')) {
            setInternalFileName(file ? file.name : null)
            setImagePreviewUrl(null)
            onFileChange(file)
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)

        setInternalFileName(file.name)
        onFileChange(file)
    }

    const shouldLabelFloat = internalFileName !== null && internalFileName !== ''

  return (
    <div className="relative w-full">
        <label
            htmlFor={id}
            className={`
                absolute left-0 top-3 px-1 text-lg tracking-wide pointer-event-none transition-all duration-200
                ${shouldLabelFloat
                    ? 'text-cyan-400 text-sm -translate-y-5 bg-gray-900 ml-2'
                    : 'text-blue-300 ml-2'
                }
            `}
        >

        </label>
        <input 
            type="file"
            id={id}
            className={`
                peer
                file:bg-gradient-to-b file:from-blue-500 file:to-blue-600 file:px-6 file:py-3 file:border-none file:rounded file:text-white file:cursor-pointer bg-gradient-to-br  text-white/80 rounded cursor-pointer w-full py-1 pl-1 pr-16 text-lg outline-none border-2 duration-200
                ${disabled ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-900 text-blue-200 border-blue-600 hover:border-blue-500'}
                ${shouldLabelFloat ? 'border-cyan-500' : ''}
                ${disabled ? 'pointer-events-none' : ''}
            `}
            onChange={handleFileChange}
            disabled={disabled}
            accept="image/*"
        />
        {internalFileName && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 truncate max-w-[calc(100%-150px)]">
                {/* {internalFileName} */}
            </span>
        )}

        {imagePreviewUrl && (
            <div className="mt-4 flex justify-center">
                <img 
                    src={imagePreviewUrl} 
                    alt="Image Preview"
                    className="max-w-full h-auto max-h-64 object-contain rounded-lg" 
                />
            </div>
        )}
    </div>
  )
}
export default SelectFile
'use client'

import React, { useState, useEffect } from 'react'

interface MultiFileProps {
  id: string
  label?: string
  onFilesChange: (files: File[]) => void
  defaultImageUrls?: string[]
  disabled?: boolean
}

const MultiFile: React.FC<MultiFileProps> = ({
  id,
  label,
  onFilesChange,
  defaultImageUrls = [],
  disabled = false,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>(defaultImageUrls)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'))

    const newPreviews = imageFiles.map(file => URL.createObjectURL(file))

    setFiles(prev => [...prev, ...imageFiles])
    setPreviewUrls(prev => [...prev, ...newPreviews])
    onFilesChange([...files, ...imageFiles])
  }

  const shouldLabelFloat = previewUrls.length > 0

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className={`
            absolute left-0 top-3 px-1 text-lg tracking-wide pointer-event-none transition-all duration-200
            ${shouldLabelFloat
              ? 'text-cyan-400 text-sm -translate-y-5 bg-gray-900 ml-2'
              : 'text-blue-300 ml-2'}
          `}
        >
          {label}
        </label>
      )}

      <input
        type="file"
        id={id}
        multiple
        accept="image/*"
        disabled={disabled}
        onChange={handleChange}
        className={`
          peer
          file:bg-gradient-to-b file:from-blue-500 file:to-blue-600 file:px-6 file:py-3 file:border-none file:rounded file:text-white file:cursor-pointer
          bg-gradient-to-br text-white/80 rounded cursor-pointer w-full py-1 pl-1 pr-16 text-lg outline-none border-2 duration-200
          ${disabled ? 'bg-gray-700 text-gray-400 border-gray-600 pointer-events-none' : 'bg-gray-900 text-blue-200 border-blue-600 hover:border-blue-500'}
          ${shouldLabelFloat ? 'border-cyan-500' : ''}
        `}
      />

      {previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Preview ${index + 1}`}
              className="max-w-full h-40 object-contain rounded-lg border border-blue-600"
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiFile

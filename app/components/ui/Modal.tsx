'use client'

import React, { useEffect, useRef } from "react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event:MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [isOpen, onClose])

    if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-5 flex items-center justify-center z-50 p-4">
        <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
        >
            <div className="flex flex-col justify-center items-center p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{title || "Modal"}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times
                </button>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}
export default Modal
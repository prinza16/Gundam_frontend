"use client"

import React, { useEffect, useRef, useState } from "react"
import { FaX } from "react-icons/fa6"

interface ModalForMobilesuitProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title: string
}

const ModalForMobilesuit: React.FC<ModalForMobilesuitProps> = ({ isOpen, onClose, children, title}) => {
    const modalRef = useRef<HTMLDivElement>(null)

    const [shouldBeVisible, setShouldBeVisible] = useState(false)
    const [shouldAnimateContent, setShouldAnimateContent] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setShouldBeVisible(true)
            const timer = setTimeout(() => setShouldAnimateContent(true), 50)
            return () => clearTimeout(timer)
        } else {
            setShouldAnimateContent(false)
            const timer = setTimeout(() => setShouldBeVisible(false), 300)
            return () => clearTimeout(timer) 
        }
    }, [isOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current && 
                !modalRef.current.contains(event.target as Node) &&
                shouldAnimateContent
            ) {
                setTimeout(() => {
                    onClose()
                }, 300)
            }
        }

        if (shouldBeVisible) {
            document.addEventListener("mousedown", handleClickOutside)
        }
    }, [shouldBeVisible, shouldAnimateContent, onClose])

    if (!shouldBeVisible && !shouldAnimateContent && !isOpen) return null

  return (
    <div
        className={`
            fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300
            ${shouldBeVisible ? "visible bg-black/70" : "invisible opacity-0"}
        `}
    >
        <div
            ref={modalRef}
            className={`
              bg-gray-900 text-blue-100 rounded-lg shadow-lg shadow-blue-500/50 border border-blue-700 max-w-2xl w-full transform transition-all duration-300 ease-out
              ${
                shouldAnimateContent
                    ? "scale-100 opacity-100"
                    : "scale-110 opacity-0"
              }
            `}
        >
            <div className="flex justify-between items-center p-4 border-b border-blue-700">
                <h2 className="text-xl font-semibold text-blue-200">
                    {title || "Modal"}
                </h2>
                <button
                    onClick={onClose}
                    className="text-blue-300 hover:text-blue-100 text-2xl p-2 cursor-pointer"
                >
                    <FaX />
                </button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    </div>
  )
}
export default ModalForMobilesuit
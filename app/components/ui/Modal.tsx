"use client";

import { useEffect, useRef, useState } from "react";
import { FaX } from "react-icons/fa6";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [shouldBeVisible, setShouldBeVisible] = useState(false);
  const [shouldAnimateContent, setShouldAnimateContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldBeVisible(true);
      const timer = setTimeout(() => setShouldAnimateContent(true), 50);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimateContent(false);
      const timer = setTimeout(() => setShouldBeVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        shouldAnimateContent
      ) {
        setTimeout(() => {
          onClose();
        }, 300);
      }
    };

    if (shouldBeVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shouldBeVisible, shouldAnimateContent, onClose]);

  if (!shouldBeVisible && !shouldAnimateContent && !isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center z-50 p-4
        transition-opacity duration-300
        ${shouldBeVisible ? "visible bg-black/70" : "invisible opacity-0"}
      `}
    >
      <div
        ref={modalRef}
        className={`
                bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden
                transform transition-all duration-300 ease-out 
                ${
                  shouldAnimateContent
                    ? "scale-100 opacity-100"
                    : "scale-110 opacity-0"
                }
            `}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {title || "Modal"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl p-2 cursor-pointer"
          >
            <FaX />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export default Modal;

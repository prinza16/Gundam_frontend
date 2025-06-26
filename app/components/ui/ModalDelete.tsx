import { FaX } from "react-icons/fa6"

interface ModalDeleteProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

const ModalDelete = ({ open, onClose, children}: ModalDeleteProps) => {
  return (
    <div 
        onClick={onClose} 
        className={`
          fixed inset-0 flex justify-center items-center transition-colors
          ${open ? "visible bg-black/70" : "invisible"}  
        `}
    >
        <div 
            onClick={(e) => e.stopPropagation()}
            className=
            {` bg-white rounded-xl shadow p-20 transition-all
                    max-w-md max-h-[90vh] overflow-y-auto 
                    flex flex-col justify-center items-center
            ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}>
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600 cursor-pointer"
                >
                    <FaX />
                </button>
                {children}
        </div>
    </div>
  )
}
export default ModalDelete
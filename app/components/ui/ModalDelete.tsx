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
            {` bg-gray-900 text-blue-100 rounded-xl shadow-lg shadow-blue-500/50 border border-blue-700 p-8 transition-all
                    max-w-md max-h-[90vh] overflow-y-auto 
                    flex flex-col justify-center items-center
            ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}>
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 rounded-lg text-blue-300 bg-transparent hover:bg-blue-800 hover:text-blue-100 cursor-pointer"
                >
                    <FaX />
                </button>
                {children}
        </div>
    </div>
  )
}
export default ModalDelete
export interface SelectFileInputProps {
    label: string
    onFileChange: (file: File | null) => void
    selectedFileName?: string | null
    id: string
    disabled?: boolean
}
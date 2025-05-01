import React, { useRef } from 'react'
import { toast } from 'sonner'
import CONFIG from '../../constants/config'
interface Props {
  onChange?: (file?: File) => void
}
const InputFile = ({ onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= CONFIG.MAX_SIZE_UPLOAD || !fileFromLocal.type.includes('image'))) {
      toast.error('Dung lượng file tối đa 1MB. Định dạng: .JPG, .JPEG, .PNG')
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }
  return (
    <div>
      <input
        ref={fileInputRef}
        type='file'
        onChange={handleChangeFile}
        className='hidden'
        accept='.jpg,.jpeg,.png'
        onClick={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(e.target as any).value = null
        }}
      />
      <button
        className='flex h-10 items-center justify-end border border-gray-400 bg-white px-6 text-sm shadow-sm text-gray-600 hover:cursor-pointer'
        onClick={handleUpload}
        type='button'
      >
        Choose image
      </button>
    </div>
  )
}

export default InputFile

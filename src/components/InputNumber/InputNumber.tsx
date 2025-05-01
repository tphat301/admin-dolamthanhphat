import { InputHTMLAttributes, useState, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    className = 'mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
    onChange,
    value = '',
    ...rest
  }: Props,
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (/^\d+/.test(value) || value === '') {
      onChange?.(e)
      setLocalValue(value)
    }
  }
  return <input className={className} onChange={handleChange} value={value || localValue} ref={ref} {...rest} />
})

export default InputNumber

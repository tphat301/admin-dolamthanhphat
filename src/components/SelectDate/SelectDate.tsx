import { useEffect, useState } from 'react'
import { range } from 'lodash'

interface Props {
  value?: Date
  onChange?: (value: Date) => void
}

const SelectDate = ({ value, onChange }: Props) => {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueSelectForm } = e.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueSelectForm)
    }
    setDate(newDate)
    onChange?.(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-2 my-4 flex flex-wrap'>
      <div className='pl-0 w-full'>
        <div className='flex justify-between'>
          <select
            name='date'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
            onChange={handleChange}
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            name='month'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
            onChange={handleChange}
            value={value?.getMonth() || date.month}
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            name='year'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3'
            onChange={handleChange}
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Năm</option>
            {range(1990, 2027).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default SelectDate

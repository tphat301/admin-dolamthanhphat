import { createSearchParams, Link } from 'react-router-dom'
import clsx from 'clsx'

interface Props {
  page: number
  page_size: number
  path: string
}

const RANGE = 2

export default function Pagination({ page, page_size, path }: Props) {
  let dotAfter = false
  let dotBefore = false

  const renderDotAfter = (index: number) => {
    if (!dotAfter) {
      dotAfter = true
      return (
        <li className='w-fit' key={index}>
          <span className='flex items-center justify-center w-[36px] h-[30px] text-header_bottom rounded-sm border border-header_bottom cursor-not-allowed bg-white'>
            ...
          </span>
        </li>
      )
    }
    return null
  }
  const renderDotBefore = (index: number) => {
    if (!dotBefore) {
      dotBefore = true
      return (
        <li className='w-fit' key={index}>
          <span className='flex items-center justify-center w-[36px] h-[30px] text-header_bottom rounded-sm border border-blue-500 cursor-not-allowed bg-white'>
            ...
          </span>
        </li>
      )
    }
    return null
  }
  const renderPagination = () => {
    return Array(page_size)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < page_size - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < page_size - RANGE * 2) {
          if (pageNumber > RANGE && pageNumber < page - RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < page_size - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= page_size - RANGE * 2 && pageNumber > RANGE && pageNumber < page_size - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <li className='w-fit' key={index}>
            <Link
              to={{
                pathname: path,
                search: createSearchParams({
                  page: pageNumber.toString()
                }).toString()
              }}
              className={clsx(
                'flex items-center justify-center w-[36px] h-[30px]  text-blue-500 rounded-sm border border-blue-500 bg-white',
                {
                  'border-0 border-transparent !bg-blue-500 text-white': page === pageNumber
                }
              )}
            >
              {pageNumber}
            </Link>
          </li>
        )
      })
  }
  return (
    <div className='lg:mt-5 mn:mt-4'>
      <ul className='flex flex-wrap justify-center gap-2'>
        {page > 1 && (
          <li className='w-fit'>
            <Link
              to={{
                pathname: path,
                search: createSearchParams({
                  page: (page - 1).toString()
                }).toString()
              }}
              className='flex h-[30px] items-center justify-center text-blue-500'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
              </svg>
            </Link>
          </li>
        )}
        {renderPagination()}
        {page < page_size && (
          <li className='w-fit'>
            <Link
              to={{
                pathname: path,
                search: createSearchParams({
                  page: (page + 1).toString()
                }).toString()
              }}
              className='flex h-[30px] items-center justify-center text-blue-500'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
              </svg>
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ...13 14 [15] 16 17 ... 19 20


1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

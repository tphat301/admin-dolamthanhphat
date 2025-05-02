import { useEffect, useMemo, useState } from 'react'
import { produce } from 'immer'
import { Card, CardContent } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Link } from 'react-router-dom'
import PATH from '../../constants/path'
import { useMutation, useQuery } from '@tanstack/react-query'
import blogApi from '../../apis/blog.apis'
import { isUndefined, keyBy, omitBy } from 'lodash'
import { useQueryParams } from '../../hooks/useQueryParams'
import { ExtendedBlogs } from '../../types/blog.types'
import Pagination from '../../components/Pagination/Pagination'
import { fullUrlImage } from '../../utils/commons'

const Blogs = () => {
  const [extendedBlogs, setExtendedBlogs] = useState<ExtendedBlogs[]>([])
  const queryParams: { page?: string; limit?: string } = useQueryParams()
  const queryObj = omitBy({ page: queryParams?.page, limit: queryParams?.limit }, isUndefined)
  const { data: blogsData, refetch } = useQuery({
    queryKey: ['blogs', queryObj],
    queryFn: () => blogApi.getBlogs(queryObj)
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogApi.deleteBlog,
    onSuccess: () => {
      refetch()
    }
  })

  const blogs = blogsData?.data?.data?.blogs
  const isAllChecked = useMemo(() => extendedBlogs.every((item) => item.checked), [extendedBlogs])

  const blogsChecked = useMemo(() => extendedBlogs.filter((item) => item.checked), [extendedBlogs])

  useEffect(() => {
    setExtendedBlogs((prev) => {
      const extendedBlogsObj = keyBy(prev, '_id')
      return (
        blogs?.map((item) => {
          return {
            ...item,
            checked: Boolean(extendedBlogsObj[item._id]?.checked)
          }
        }) || []
      )
    })
  }, [blogs, setExtendedBlogs])

  const handleCheck = (blogIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedBlogs(
      produce((draf) => {
        draf[blogIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedBlogs((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          checked: !isAllChecked
        }
      })
    })
  }

  const handleDeleteBlog = (blogIndex: number) => () => {
    const id = extendedBlogs[blogIndex]._id
    deleteBlogMutation.mutate({ ids: [id] })
  }

  const handleDeleteAllBlog = () => {
    const ids = blogsChecked.map((item) => item._id)
    if (blogsChecked.length > 0) deleteBlogMutation.mutate({ ids })
  }
  return (
    <div className='w-[calc(100%-20px)] mx-auto'>
      <div className=' flex items-center gap-x-2'>
        <Link
          to={PATH.BLOG_CREATE}
          className='flex items-center justify-center gap-x-1 px-3 py-1.5 bg-green-500 w-fit rounded-sm text-white'
        >
          <span className='text-sm capitalize'>Create</span>
        </Link>
        <button
          className='flex items-center justify-center gap-x-1 px-3 py-1.5 bg-red-500 w-fit rounded-sm text-white text-sm capitalize hover:cursor-pointer'
          onClick={handleDeleteAllBlog}
        >
          Delete all
        </button>
      </div>
      <Card className='w-full mx-auto my-4 p-0'>
        <CardContent className='p-0'>
          <h2 className='text-lg font-semibold mb-0 p-3 border-b border-gray-300'>Blogs list</h2>
          <div className='p-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type='checkbox'
                      className='accent-blue-400'
                      checked={extendedBlogs.length > 0 ? isAllChecked : false}
                      onChange={handleCheckAll}
                    />
                  </TableHead>
                  <TableHead>STT</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extendedBlogs.length > 0 ? (
                  extendedBlogs.map((item, index) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <input
                          type='checkbox'
                          className='accent-blue-400'
                          checked={item.checked}
                          onChange={handleCheck(index)}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <img
                          crossOrigin='anonymous'
                          className='w-[50px]'
                          src={fullUrlImage(item?.image as string) || '/noimage.png'}
                          alt=''
                        />
                      </TableCell>
                      <TableCell>
                        <Link to={`${PATH.BLOG_DETAIL_DEFAULT}${item._id}`}>{item.title}</Link>
                      </TableCell>
                      <TableCell>
                        <span className='text-red-500 font-bold hover:cursor-pointer' onClick={handleDeleteBlog(index)}>
                          Delete
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center'>
                      Data empty
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {extendedBlogs.length > 0 && (
              <Pagination
                path={PATH.BLOGS}
                page={Number(queryParams?.page) || 1}
                page_size={blogsData?.data?.data?.total_page || 10}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blogs

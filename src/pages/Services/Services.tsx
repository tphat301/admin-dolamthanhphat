import { useEffect, useMemo, useState } from 'react'
import { produce } from 'immer'
import { Card, CardContent } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Link } from 'react-router-dom'
import PATH from '../../constants/path'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isUndefined, keyBy, omitBy } from 'lodash'
import { useQueryParams } from '../../hooks/useQueryParams'
import Pagination from '../../components/Pagination/Pagination'
import { fullUrlImage } from '../../utils/commons'
import { ExtendedServices } from '../../types/service.types'
import serviceApi from '../../apis/service.apis'

const Services = () => {
  const [extendedServices, setExtendedServices] = useState<ExtendedServices[]>([])
  const queryParams: { page?: string; limit?: string } = useQueryParams()
  const queryObj = omitBy({ page: queryParams?.page, limit: queryParams?.limit }, isUndefined)
  const { data: servicesData, refetch } = useQuery({
    queryKey: ['services', queryObj],
    queryFn: () => serviceApi.getServices(queryObj)
  })

  const deleteServiceMutation = useMutation({
    mutationFn: serviceApi.deleteService,
    onSuccess: () => {
      refetch()
    }
  })

  const services = servicesData?.data?.data?.services
  const isAllChecked = useMemo(() => extendedServices.every((item) => item.checked), [extendedServices])

  const servicesChecked = useMemo(() => extendedServices.filter((item) => item.checked), [extendedServices])

  useEffect(() => {
    setExtendedServices((prev) => {
      const extendedBlogsObj = keyBy(prev, '_id')
      return (
        services?.map((item) => {
          return {
            ...item,
            checked: Boolean(extendedBlogsObj[item._id]?.checked)
          }
        }) || []
      )
    })
  }, [services, setExtendedServices])

  const handleCheck = (serviceIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedServices(
      produce((draf) => {
        draf[serviceIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedServices((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          checked: !isAllChecked
        }
      })
    })
  }

  const handleDeleteService = (serviceIndex: number) => () => {
    const id = extendedServices[serviceIndex]._id
    deleteServiceMutation.mutate({ ids: [id] })
  }

  const handleDeleteAllService = () => {
    const ids = servicesChecked.map((item) => item._id)
    if (servicesChecked.length > 0) deleteServiceMutation.mutate({ ids })
  }
  return (
    <div className='w-[calc(100%-20px)] mx-auto'>
      <div className=' flex items-center gap-x-2'>
        <Link
          to={PATH.SERVICE_CREATE}
          className='flex items-center justify-center gap-x-1 px-3 py-1.5 bg-green-500 w-fit rounded-sm text-white'
        >
          <span className='text-sm capitalize'>Create</span>
        </Link>
        <button
          className='flex items-center justify-center gap-x-1 px-3 py-1.5 bg-red-500 w-fit rounded-sm text-white text-sm capitalize hover:cursor-pointer'
          onClick={handleDeleteAllService}
        >
          Delete all
        </button>
      </div>
      <Card className='w-full mx-auto my-4 p-0'>
        <CardContent className='p-0'>
          <h2 className='text-lg font-semibold mb-0 p-3 border-b border-gray-300'>Service list</h2>
          <div className='p-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type='checkbox'
                      className='accent-blue-400'
                      checked={extendedServices.length > 0 ? isAllChecked : false}
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
                {extendedServices.length > 0 ? (
                  extendedServices.map((item, index) => (
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
                        <Link to={`${PATH.SERVICE_DETAIL_DEFAULT}${item._id}`}>{item.title}</Link>
                      </TableCell>
                      <TableCell>
                        <span
                          className='text-red-500 font-bold hover:cursor-pointer'
                          onClick={handleDeleteService(index)}
                        >
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
            {extendedServices.length > 0 && (
              <Pagination
                path={PATH.SERVICES}
                page={Number(queryParams?.page) || 1}
                page_size={servicesData?.data?.data?.total_page || 10}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Services

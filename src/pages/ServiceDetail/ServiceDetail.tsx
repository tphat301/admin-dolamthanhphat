import { useParams } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'
import * as yup from 'yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fullUrlImage } from '../../utils/commons'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import AuthInput from '../../components/AuthInput'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import { useEffect, useMemo, useState } from 'react'
import InputFile from '../../components/InputFile'
import { httpStatusCode } from '../../constants/httpStatusCode'
import { toast } from 'sonner'
import serviceApi from '../../apis/service.apis'
import { updateServiceSchema } from '../../utils/validation'

type UpdateServiceSchema = yup.InferType<typeof updateServiceSchema>

const ServiceDetail = () => {
  const [file, setFile] = useState<File>()
  const { serviceId } = useParams()
  const { data: serviceDetailData } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => serviceApi.getServiceDetail(serviceId as string)
  })

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const service = serviceDetailData?.data?.data

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UpdateServiceSchema>({
    defaultValues: {
      id: serviceId,
      image: '',
      title: '',
      description: ''
    },
    resolver: yupResolver(updateServiceSchema as yup.ObjectSchema<UpdateServiceSchema>)
  })
  const image = watch('image')
  const updateServiceMutation = useMutation({
    mutationFn: serviceApi.updateService
  })
  const uploadImageMutation = useMutation({
    mutationFn: serviceApi.uploadImageService
  })

  const onSubmit = handleSubmit(async (data) => {
    let imageResult = image
    if (file) {
      const form = new FormData()
      form.append('image', file)
      const uploadRes = await uploadImageMutation.mutateAsync(form)
      const resNameImage = uploadRes.data.data.name
      imageResult = resNameImage
    }
    const dataResult = imageResult ? { ...data, image: imageResult } : data
    updateServiceMutation.mutateAsync(dataResult, {
      onSuccess: (data) => {
        toast.success('Alert', {
          description: data.data.message,
          action: {
            label: 'Đóng',
            onClick: () => true
          },
          duration: 4000,
          position: 'top-right'
        })
      },
      onError: (error: any) => {
        if (error.status === httpStatusCode.UnprocessableEntity) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof UpdateServiceSchema, {
                message: formError[key as keyof UpdateServiceSchema]['msg'],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  useEffect(() => {
    setValue('title', service?.title)
    setValue('image', service?.image)
    setValue('description', service?.description)
  }, [service, setValue])

  const handleChangeFile = (file?: File) => setFile(file)

  return (
    <div className='w-[calc(100%-20px)] mx-auto my-3'>
      <div className='grid sm:grid-cols-1 md:grid-cols-12 gap-x-3'>
        <div className='w-full md:col-span-8 mx-auto sm:col-span-12'>
          <Card className='mx-auto p-0'>
            <CardContent className='p-0'>
              <h2 className='text-lg font-semibold mb-2 p-3 border-b border-gray-300'>Service update</h2>
              <div className='p-3'>
                <form onSubmit={onSubmit}>
                  <div className='mb-4'>
                    <label htmlFor='title' className='block text-sm font-medium text-gray-700-foreground'>
                      Title
                    </label>
                    <AuthInput register={register} type='text' name='title' placeholder='Title' />
                    {errors?.title && <span className='text-red-600'>{errors?.title?.message}</span>}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-700-foreground'>
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      placeholder='Description'
                      className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                    ></textarea>
                    {errors?.description && <span className='text-red-600'>{errors?.description?.message}</span>}
                  </div>
                  <ButtonSubmitForm type='submit' isLoading={isSubmitting} disabled={isSubmitting}>
                    Update
                  </ButtonSubmitForm>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='md:col-span-4 sm:col-span-12'>
          <Card className='mx-auto p-0'>
            <CardContent className='p-0'>
              <h2 className='text-lg font-semibold mb-2 p-3 border-b border-gray-300'>Photo</h2>
              <div className='p-3'>
                <div className='flex justify-center'>
                  <div className='flex flex-col items-center'>
                    <div className='my-5'>
                      <img
                        crossOrigin='anonymous'
                        src={previewImage || fullUrlImage(service?.image as string) || '/noimage.png'}
                        className='w-full h-full object-cover'
                        alt='Photo'
                      />
                    </div>
                    <InputFile onChange={handleChangeFile} />
                    <div className='mt-3 text-gray-400'>Max file size 1 MB</div>
                    <div className='mt-1 text-gray-400'>Allow type: .JPG, .JPEG, .PNG</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail

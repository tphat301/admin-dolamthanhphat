import AuthInput from '../../components/AuthInput'
import { Card, CardContent } from '../../components/ui/card'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createServiceSchema } from '../../utils/validation'
import { useForm } from 'react-hook-form'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import { useMutation } from '@tanstack/react-query'
import { httpStatusCode } from '../../constants/httpStatusCode'
import { toast } from 'sonner'
import InputFile from '../../components/InputFile'
import { useMemo, useState } from 'react'
import serviceApi from '../../apis/service.apis'

type CreateServiceSchema = yup.InferType<typeof createServiceSchema>

const ServiceCreate = () => {
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateServiceSchema>({
    defaultValues: {
      image: '',
      title: '',
      description: ''
    },
    resolver: yupResolver(createServiceSchema as yup.ObjectSchema<CreateServiceSchema>)
  })
  const image = watch('image')
  const createServiceMutation = useMutation({
    mutationFn: serviceApi.createService
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
    createServiceMutation.mutateAsync(dataResult, {
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
        reset()
        setFile(undefined)
      },
      onError: (error: any) => {
        if (error.status === httpStatusCode.UnprocessableEntity) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof CreateServiceSchema, {
                message: formError[key as keyof CreateServiceSchema]['msg'],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  const handleChangeFile = (file?: File) => setFile(file)

  return (
    <div className='w-[calc(100%-20px)] mx-auto my-3'>
      <div className='grid sm:grid-cols-1 md:grid-cols-12 gap-x-3'>
        <div className='w-full md:col-span-8 mx-auto sm:col-span-12'>
          <Card className='mx-auto p-0'>
            <CardContent className='p-0'>
              <h2 className='text-lg font-semibold mb-2 p-3 border-b border-gray-300'>Service Create</h2>
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
                    Create
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
                      <img src={previewImage || '/noimage.png'} className='w-full h-full object-cover' alt='' />
                    </div>
                    <InputFile onChange={handleChangeFile} />
                    <div className='mt-3 text-gray-400'>Dung lượng tối đa 1 MB</div>
                    <div className='mt-1 text-gray-400'>Định dạng: .JPG, .JPEG, .PNG</div>
                    {errors?.image && <span className='text-red-600'>{errors?.image?.message}</span>}
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

export default ServiceCreate

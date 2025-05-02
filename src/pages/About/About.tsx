import * as yup from 'yup'
import { aboutSchema } from '../../utils/validation'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import aboutApi from '../../apis/about.apis'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { httpStatusCode } from '../../constants/httpStatusCode'
import { Card, CardContent } from '../../components/ui/card'
import AuthInput from '../../components/AuthInput'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import InputFile from '../../components/InputFile'
import { fullUrlImage } from '../../utils/commons'

type AboutSchema = yup.InferType<typeof aboutSchema>

const About = () => {
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<AboutSchema>({
    defaultValues: {
      image: '',
      title: '',
      description: '',
      seo_title: '',
      seo_keywords: '',
      seo_description: ''
    },
    resolver: yupResolver(aboutSchema as yup.ObjectSchema<AboutSchema>)
  })

  const image = watch('image')

  const { data: aboutData } = useQuery({
    queryKey: ['about'],
    queryFn: aboutApi.getAbout,
    retry: false
  })

  const aboutRes = aboutData?.data.data

  useEffect(() => {
    if (aboutRes) {
      setValue('title', aboutRes.title)
      setValue('description', aboutRes.description)
      setValue('image', aboutRes.image)
      setValue('seo_title', aboutRes.seo_title)
      setValue('seo_keywords', aboutRes.seo_keywords)
      setValue('seo_description', aboutRes.seo_description)
    }
  }, [aboutRes, setValue])

  const createAboutMutation = useMutation({
    mutationFn: aboutApi.createAbout
  })

  const updateAboutMutation = useMutation({
    mutationFn: aboutApi.updateAbout
  })

  const uploadImageMutation = useMutation({
    mutationFn: aboutApi.uploadImageAbout
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
    if (aboutRes !== undefined) {
      const idAbout = aboutRes._id
      const dataObj = imageResult ? { ...data, id: idAbout, image: imageResult } : { ...data, id: idAbout }
      updateAboutMutation.mutateAsync(dataObj, {
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
                setError(key as keyof AboutSchema & { id: string }, {
                  message: formError[key as keyof AboutSchema & { id: string }]['msg'],
                  type: 'Server'
                })
              })
            }
          }
        }
      })
    } else {
      const dataObj = imageResult ? { ...data, image: imageResult } : data
      createAboutMutation.mutate(dataObj, {
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
                setError(key as keyof AboutSchema, {
                  message: formError[key as keyof AboutSchema]['msg'],
                  type: 'Server'
                })
              })
            }
          }
        }
      })
    }
  })

  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='w-[calc(100%-20px)] mx-auto my-3'>
      <div className='grid sm:grid-cols-1 md:grid-cols-12 gap-x-3'>
        <div className='w-full md:col-span-8 mx-auto sm:col-span-12'>
          <Card className='mx-auto p-0'>
            <CardContent className='p-0'>
              <h2 className='text-lg font-semibold mb-2 p-3 border-b border-gray-300'>Blog Create</h2>
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
                  <div className='mb-4'>
                    <label htmlFor='seo_title' className='block text-sm font-medium text-gray-700-foreground'>
                      Title (SEO)
                    </label>
                    <AuthInput register={register} type='text' name='seo_title' placeholder='Title SEO' />
                    {errors?.seo_title && <span className='text-red-600'>{errors?.seo_title?.message}</span>}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='seo_keywords' className='block text-sm font-medium text-gray-700-foreground'>
                      Keywords (SEO)
                    </label>
                    <AuthInput register={register} type='text' name='seo_keywords' placeholder='Keywords' />
                    {errors?.seo_keywords && <span className='text-red-600'>{errors?.seo_keywords?.message}</span>}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='seo_description' className='block text-sm font-medium text-gray-700-foreground'>
                      Description (SEO)
                    </label>
                    <textarea
                      {...register('seo_description')}
                      placeholder='Description'
                      className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                    ></textarea>
                    {errors?.seo_description && (
                      <span className='text-red-600'>{errors?.seo_description?.message}</span>
                    )}
                  </div>
                  <ButtonSubmitForm type='submit' isLoading={isSubmitting} disabled={isSubmitting}>
                    Submit
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
                        src={previewImage || fullUrlImage(aboutRes?.image as string) || '/noimage.png'}
                        className='w-full h-full object-cover'
                        alt='Title'
                        crossOrigin='anonymous'
                      />
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

export default About

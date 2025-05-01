import { useParams } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'
import * as yup from 'yup'
import noimage from '../../../public/noimage.png'
import blogApi from '../../apis/blog.apis'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fullUrlImage, slugify } from '../../utils/commons'
import { updateBlogSchema } from '../../utils/validation'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import AuthInput from '../../components/AuthInput'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import MyEditor from '../../components/MyEditor'
import { useEffect, useMemo, useState } from 'react'
import InputFile from '../../components/InputFile'
import { httpStatusCode } from '../../constants/httpStatusCode'
import { toast } from 'sonner'

type UpdateBlogSchema = yup.InferType<typeof updateBlogSchema>

const BlogDetail = () => {
  const [file, setFile] = useState<File>()
  const { blogId } = useParams()
  const { data: blogDetailData } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogApi.getBlogDetail(blogId as string)
  })

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const blog = blogDetailData?.data?.data

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<UpdateBlogSchema>({
    defaultValues: {
      id: blogId,
      image: '',
      slug: '',
      title: '',
      description: '',
      content: '',
      seo_title: '',
      seo_keywords: '',
      seo_description: ''
    },
    resolver: yupResolver(updateBlogSchema as yup.ObjectSchema<UpdateBlogSchema>)
  })
  const image = watch('image')
  const updateBlogMutation = useMutation({
    mutationFn: blogApi.updateBlog
  })
  const uploadImageMutation = useMutation({
    mutationFn: blogApi.uploadImageBlog
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
    updateBlogMutation.mutateAsync(dataResult, {
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
              setError(key as keyof UpdateBlogSchema, {
                message: formError[key as keyof UpdateBlogSchema]['msg'],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  useEffect(() => {
    setValue('slug', blog?.slug)
    setValue('title', blog?.title)
    setValue('image', blog?.image)
    setValue('description', blog?.description)
    setValue('content', blog?.content)
    setValue('seo_title', blog?.seo_title)
    setValue('seo_keywords', blog?.seo_keywords)
    setValue('seo_description', blog?.seo_description)
  }, [blog, setValue])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('slug', slugify(newTitle))
  }

  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='w-[calc(100%-20px)] mx-auto my-3'>
      <div className='grid sm:grid-cols-1 md:grid-cols-12 gap-x-3'>
        <div className='w-full md:col-span-8 mx-auto sm:col-span-12'>
          <Card className='mx-auto p-0'>
            <CardContent className='p-0'>
              <h2 className='text-lg font-semibold mb-2 p-3 border-b border-gray-300'>Blog Detail</h2>
              <div className='p-3'>
                <form onSubmit={onSubmit}>
                  <div className='mb-4'>
                    <label htmlFor='slug' className='block text-sm font-medium text-gray-700-foreground'>
                      Slug
                    </label>
                    <AuthInput register={register} type='text' name='slug' placeholder='Slug' />
                    {errors?.slug && <span className='text-red-600'>{errors?.slug?.message}</span>}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='title' className='block text-sm font-medium text-gray-700-foreground'>
                      Title
                    </label>
                    <AuthInput
                      register={register}
                      type='text'
                      onChange={handleTitleChange}
                      name='title'
                      placeholder='Title'
                    />
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
                    <label htmlFor='content' className='block text-sm font-medium text-gray-700-foreground'>
                      Content
                    </label>
                    <Controller
                      control={control}
                      name='content'
                      render={({ field }) => {
                        return <MyEditor value={field.value as string} onChange={field.onChange} />
                      }}
                    />
                    {errors?.content && <span className='text-red-600'>{errors?.content?.message}</span>}
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
                        src={previewImage || fullUrlImage(blog?.image as string) || noimage}
                        className='w-full h-full object-cover'
                        alt=''
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

export default BlogDetail

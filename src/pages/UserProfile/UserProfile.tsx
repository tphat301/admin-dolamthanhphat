import { useContext, useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import AuthInput from '../../components/AuthInput'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import { Card, CardContent } from '../../components/ui/card'
import SelectDate from '../../components/SelectDate'
import InputNumber from '../../components/InputNumber'
import { userSchema } from '../../utils/validation'
import InputFile from '../../components/InputFile'
import { fullUrlImage } from '../../utils/commons'
import { useMutation, useQuery } from '@tanstack/react-query'
import userApi from '../../apis/user.apis'
import { AppContext } from '../../contexts/app.context'
import { httpStatusCode } from '../../constants/httpStatusCode'
import { toast } from 'sonner'
import { isUndefined, omitBy } from 'lodash'
import { setProfileToLS } from '../../utils/auths'

type UserSchema = yup.InferType<typeof userSchema>

const UserProfile = () => {
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile-data'],
    queryFn: userApi.getProfile
  })
  const profileUser = profileData?.data?.data

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<UserSchema>({
    defaultValues: { name: '', phone: '', address: '', date_of_birth: new Date(1990, 0, 1), avatar: '' },
    resolver: yupResolver(userSchema as yup.ObjectSchema<UserSchema>)
  })

  const avatar = watch('avatar')

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })

  useEffect(() => {
    setValue('name', profileUser?.name)
    setValue('address', profileUser?.address)
    setValue('avatar', profileUser?.avatar)
    setValue('phone', profileUser?.phone)
    setValue('date_of_birth', profileUser?.date_of_birth ? new Date(profileUser.date_of_birth) : new Date(1990, 0, 1))
  }, [profileUser, setValue])

  const onSubmit = handleSubmit(async (data) => {
    let imageResult = avatar
    if (file) {
      const form = new FormData()
      form.append('image', file)
      const uploadRes = await uploadAvatarMutation.mutateAsync(form)
      const resNameImage = uploadRes.data.data.data.name
      imageResult = resNameImage
    }
    const dataResult = imageResult
      ? { ...data, avatar: imageResult, date_of_birth: data.date_of_birth?.toISOString() }
      : { ...data, date_of_birth: data.date_of_birth?.toISOString() }
    const dataResultNoUndefine = omitBy(dataResult, isUndefined)
    updateProfileMutation.mutateAsync(dataResultNoUndefine, {
      onSuccess: (data) => {
        refetch()
        setProfile(data.data.data)
        setProfileToLS(data.data.data)
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
              setError(key as keyof UserSchema, {
                message: formError[key as keyof UserSchema]['msg'],
                type: 'Server'
              })
            })
          }
        }
      }
    })
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
              <h2 className='text-lg font-semibold mb-2 p-3 border-b border-gray-300'>Profile</h2>
              <div className='p-3'>
                <form onSubmit={onSubmit}>
                  <div className='mb-4'>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700-foreground'>
                      Fullname
                    </label>
                    <AuthInput register={register} type='text' name='name' placeholder='Enter your fullname...' />
                    {errors?.name && <span className='text-red-600'>{errors?.name?.message}</span>}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='address' className='block text-sm font-medium text-gray-700-foreground'>
                      Address
                    </label>
                    <AuthInput register={register} type='text' name='address' placeholder='Enter your address...' />
                    {errors?.address && <span className='text-red-600'>{errors?.address?.message}</span>}
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='phone' className='block text-sm font-medium text-gray-700-foreground'>
                      Phone
                    </label>
                    <Controller
                      control={control}
                      name='phone'
                      render={({ field }) => (
                        <InputNumber type='text' placeholder='Enter your phone' {...field} onChange={field.onChange} />
                      )}
                    />
                  </div>
                  {errors?.phone && <span className='text-red-600'>{errors?.phone?.message}</span>}

                  <div className='mb-4'>
                    <label htmlFor='date_of_birth' className='block text-sm font-medium text-gray-700-foreground'>
                      Date of birth
                    </label>
                    <Controller
                      control={control}
                      name='date_of_birth'
                      render={({ field }) => {
                        return <SelectDate {...field} onChange={field.onChange} />
                      }}
                    />
                    {errors?.date_of_birth && <span className='text-red-600'>{errors?.date_of_birth?.message}</span>}
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
                        src={previewImage || fullUrlImage(profileUser?.avatar as string) || '/noimage.png'}
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

export default UserProfile

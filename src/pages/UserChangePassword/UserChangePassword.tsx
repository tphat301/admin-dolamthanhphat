import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardContent } from '../../components/ui/card'
import { toast } from 'sonner'
import AuthInput from '../../components/AuthInput'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import { changePasswordSchema } from '../../utils/validation'
import { useMutation } from '@tanstack/react-query'
import userApi from '../../apis/user.apis'
import { httpStatusCode } from '../../constants/httpStatusCode'

type ChangePasswordSchema = yup.InferType<typeof changePasswordSchema>

const UserChangePassword = () => {
  const {
    register,
    setError,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordSchema>({
    defaultValues: {
      old_password: '',
      password: '',
      confirm_password: ''
    },
    resolver: yupResolver(changePasswordSchema)
  })

  const changePasswordMutation = useMutation({
    mutationFn: (body: ChangePasswordSchema) => userApi.changePassword(body)
  })

  const onSubmit = handleSubmit((data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: (data) => {
        reset()
        toast.success(data.data.message)
      },
      onError: (error: any) => {
        if (error.status === httpStatusCode.UnprocessableEntity) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof ChangePasswordSchema, {
                message: formError[key as keyof ChangePasswordSchema]['msg'],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='w-[calc(100%-20px)] mx-auto my-3'>
      <div className='w-full mx-auto'>
        <Card className='mx-auto p-0'>
          <CardContent className='p-0'>
            <h2 className='text-lg font-semibold mb-2 p-3 border-b border-gray-300'>Change password admin account</h2>
            <div className='p-3'>
              <form onSubmit={onSubmit}>
                <div className='mb-4'>
                  <label htmlFor='old_password' className='block text-sm font-medium text-gray-700-foreground'>
                    Old password
                  </label>
                  <AuthInput
                    register={register}
                    type='password'
                    name='old_password'
                    placeholder='Enter your old password'
                  />
                  {errors?.old_password && <span className='text-red-600'>{errors?.old_password?.message}</span>}
                </div>
                <div className='mb-4'>
                  <label htmlFor='password' className='block text-sm font-medium text-gray-700-foreground'>
                    New password
                  </label>
                  <AuthInput register={register} type='password' name='password' placeholder='Enter your password' />
                  {errors?.password && <span className='text-red-600'>{errors?.password?.message}</span>}
                </div>
                <div className='mb-4'>
                  <label htmlFor='confirm_password' className='block text-sm font-medium text-gray-700-foreground'>
                    Confirm new password
                  </label>
                  <AuthInput
                    register={register}
                    type='password'
                    name='confirm_password'
                    placeholder='Enter your confirm password'
                  />
                  {errors?.confirm_password && (
                    <span className='text-red-600'>{errors?.confirm_password?.message}</span>
                  )}
                </div>
                <ButtonSubmitForm type='submit' isLoading={isSubmitting} disabled={isSubmitting}>
                  Change password
                </ButtonSubmitForm>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserChangePassword

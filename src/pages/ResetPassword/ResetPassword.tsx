import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { resetPasswordSchema } from '../../utils/validation'
import PATH from '../../constants/path'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import AuthInput from '../../components/AuthInput'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../apis/auth.apis'
import { httpStatusCode } from '../../constants/httpStatusCode'
import { toast } from 'sonner'

type ResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>
type PayloadBody = ResetPasswordSchema & { forgot_password_token: string }

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordSchema>({
    defaultValues: {
      password: '',
      confirm_password: ''
    },
    resolver: yupResolver(resetPasswordSchema)
  })
  const resetPasswordMutation = useMutation({
    mutationFn: (body: PayloadBody) => authApi.resetPassword(body)
  })
  const onSubmit = handleSubmit((data) => {
    if (!token) return
    const dataResult: PayloadBody = { ...data, forgot_password_token: token }
    resetPasswordMutation.mutate(dataResult, {
      onSuccess: (data) => {
        toast.success(data.data.message)
        setTimeout(() => navigate(PATH.LOGIN), 4000)
      },
      onError: (error: any) => {
        if (error.status === httpStatusCode.UnprocessableEntity) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof ResetPasswordSchema, {
                message: formError[key as keyof ResetPasswordSchema]['msg'],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  return (
    <div className='min-h-screen flex'>
      <div className='w-full flex items-center justify-center bg-white-foreground p-8'>
        <div className='max-w-md w-full'>
          <h2 className='text-2xl font-bold text-gray-900-foreground mb-2 text-center capitalize'>
            Reset Password Account
          </h2>
          <form onSubmit={onSubmit}>
            <div className='mb-4'>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700-foreground'>
                Password:
              </label>
              <AuthInput type='password' register={register} name='password' placeholder='Enter your password...' />
              {errors?.password && <span className='text-red-600'>{errors?.password?.message}</span>}
            </div>
            <div className='mb-4'>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700-foreground'>
                Confirm Password:
              </label>
              <AuthInput
                type='password'
                register={register}
                name='confirm_password'
                placeholder='Enter your confirm password...'
              />
              {errors?.confirm_password && <span className='text-red-600'>{errors?.confirm_password?.message}</span>}
            </div>
            <ButtonSubmitForm
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow mb-4'
              type='submit'
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit
            </ButtonSubmitForm>
          </form>
          <div className='flex items-center flex-col mn:justify-center lg:justify-between'>
            <div className='flex flex-wrap flex-col'>
              <Link to={PATH.LOGIN} className='text-indigo-600-foreground hover:underline text-sm'>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword

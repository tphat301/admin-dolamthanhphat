import * as yup from 'yup'
import { loginSchema } from '../../utils/validation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'
import PATH from '../../constants/path'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import AuthInput from '../../components/AuthInput'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../apis/auth.apis'
import { httpStatusCode } from '../../constants/httpStatusCode'
import { toast } from 'sonner'

const forgotPasswordSchema = loginSchema.pick(['email'])
type ForgotPasswordSchema = yup.InferType<typeof forgotPasswordSchema>

const ForgotPassword = () => {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordSchema>({
    defaultValues: {
      email: ''
    },
    resolver: yupResolver(forgotPasswordSchema)
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (body: ForgotPasswordSchema) => authApi.forgotPassword(body)
  })

  const onSubmit = handleSubmit((data) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.data.message)
      },
      onError: (error: any) => {
        if (error.status === httpStatusCode.UnprocessableEntity) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof ForgotPasswordSchema, {
                message: formError[key as keyof ForgotPasswordSchema]['msg'],
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
          <h2 className='text-2xl font-bold text-gray-900-foreground mb-2 text-center capitalize'>Login Account</h2>
          <form onSubmit={onSubmit}>
            <div className='mb-4'>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700-foreground'>
                Email:
              </label>
              <AuthInput type='email' register={register} name='email' placeholder='Enter your email...' />
              {errors?.email && <span className='text-red-600'>{errors?.email?.message}</span>}
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

export default ForgotPassword

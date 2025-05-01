import * as yup from 'yup'
import AuthInput from '../../components/AuthInput'
import ButtonSubmitForm from '../../components/ButtonSubmitForm'
import { loginSchema } from '../../utils/validation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../apis/auth.apis'
import { httpStatusCode } from '../../constants/httpStatusCode'
import PATH from '../../constants/path'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'

type LoginSchema = yup.InferType<typeof loginSchema>

const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchema>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: LoginSchema) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate(PATH.HOME)
      },
      onError: (error: any) => {
        if (error.status === httpStatusCode.UnprocessableEntity) {
          const formError = error.response?.data?.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof LoginSchema, {
                message: formError[key as keyof LoginSchema]['msg'],
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
            <div className='mb-4'>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700-foreground'>
                Password:
              </label>
              <AuthInput type='password' register={register} name='password' placeholder='Enter your password...' />
              {errors?.password && <span className='text-red-600'>{errors?.password?.message}</span>}
            </div>
            <ButtonSubmitForm
              className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow mb-4'
              type='submit'
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Login
            </ButtonSubmitForm>
          </form>
          <div className='flex items-center flex-col mn:justify-center lg:justify-between'>
            <div className='flex flex-wrap flex-col'>
              <Link to={PATH.FORGOT_PASSWORD} className='text-indigo-600-foreground hover:underline text-sm'>
                Quên mật khẩu?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

import { Outlet } from 'react-router-dom'
import AuthHeader from '../../components/AuthHeader'

const AuthLayout = () => {
  return (
    <div>
      <AuthHeader />
      <Outlet />
    </div>
  )
}

export default AuthLayout

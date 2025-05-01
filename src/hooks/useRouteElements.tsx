import { useRoutes, Navigate, Outlet } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { lazy, Suspense, useContext } from 'react'
import AuthLayout from '../layouts/AuthLayout'
import PATH from '../constants/path'
import { AppContext } from '../contexts/app.context'

const NotFound = lazy(() => import('../pages/NotFound'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Login = lazy(() => import('../pages/Login'))
const Blogs = lazy(() => import('../pages/Blogs'))
const BlogDetail = lazy(() => import('../pages/BlogDetail'))
const BlogCreate = lazy(() => import('../pages/BlogCreate'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))
const UserChangePassword = lazy(() => import('../pages/UserChangePassword'))
const UserProfile = lazy(() => import('../pages/UserProfile'))
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const ServiceCreate = lazy(() => import('../pages/ServiceCreate'))
const ServiceDetail = lazy(() => import('../pages/ServiceDetail'))

// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

// eslint-disable-next-line react-refresh/only-export-components
const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  return useRoutes([
    {
      path: '',
      element: <AuthLayout />,
      children: [
        {
          path: PATH.FORGOT_PASSWORD,
          element: (
            <Suspense>
              <ForgotPassword />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '',
      element: <AuthLayout />,
      children: [
        {
          path: PATH.RESET_PASSWORD,
          element: (
            <Suspense>
              <ResetPassword />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: PATH.HOME,
          element: <MainLayout />,
          children: [
            {
              index: true, // 👈 Đây là route mặc định
              element: <Navigate to={PATH.DASHBOARD} replace />
            },
            {
              path: PATH.DASHBOARD,
              element: (
                <Suspense>
                  <Dashboard />
                </Suspense>
              )
            },
            {
              path: PATH.BLOGS,
              element: (
                <Suspense>
                  <Blogs />
                </Suspense>
              )
            },
            {
              path: PATH.BLOG_DETAIL,
              element: (
                <Suspense>
                  <BlogDetail />
                </Suspense>
              )
            },
            {
              path: PATH.BLOG_CREATE,
              element: (
                <Suspense>
                  <BlogCreate />
                </Suspense>
              )
            },
            {
              path: PATH.CHANGE_PASSWORD,
              element: (
                <Suspense>
                  <UserChangePassword />
                </Suspense>
              )
            },
            {
              path: PATH.PROFILE,
              element: (
                <Suspense>
                  <UserProfile />
                </Suspense>
              )
            },
            {
              path: PATH.ABOUT,
              element: (
                <Suspense>
                  <About />
                </Suspense>
              )
            },
            {
              path: PATH.SERVICES,
              element: (
                <Suspense>
                  <Services />
                </Suspense>
              )
            },
            {
              path: PATH.SERVICE_CREATE,
              element: (
                <Suspense>
                  <ServiceCreate />
                </Suspense>
              )
            },
            {
              path: PATH.SERVICE_DETAIL,
              element: (
                <Suspense>
                  <ServiceDetail />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <AuthLayout />,
          children: [
            {
              path: PATH.LOGIN,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: (
        <Suspense>
          <NotFound />
        </Suspense>
      )
    }
  ])
}

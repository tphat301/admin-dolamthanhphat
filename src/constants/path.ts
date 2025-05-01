const PATH = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  DASHBOARD: '/dashboard',
  BLOGS: '/blogs',
  SERVICES: '/services',
  BLOG_DETAIL: '/blogs/detail/:blogId',
  SERVICE_DETAIL: '/services/detail/:serviceId',
  BLOG_CREATE: '/blogs/create',
  SERVICE_CREATE: '/services/create',
  SETTING: '/setting',
  PROFILE: '/profile',
  BLOG_DETAIL_DEFAULT: '/blogs/detail/',
  SERVICE_DETAIL_DEFAULT: '/services/detail/',
  ABOUT: '/about'
} as const

export default PATH

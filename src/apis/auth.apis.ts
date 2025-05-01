import { AuthSuccessResponeApi } from '../types/auth.types'
import http from '../utils/http'

export const URL_LOGIN = 'admin-account/login'
export const URL_REGISTER = 'admin-account/register'
export const URL_LOGOUT = 'admin-account/logout'
export const URL_REFRESH_TOKEN = 'admin-account/refresh-token'
export const URL_FORGOT_PASSWORD = 'admin-account/forgot-password'
export const URL_RESET_PASSWORD = 'admin-account/reset-password'

const authApi = {
  login(body: { email: string; password: string }) {
    return http.post<AuthSuccessResponeApi>(URL_LOGIN, body)
  },
  logout(body: { refresh_token: string }) {
    return http.post<{ message: string }>(URL_LOGOUT, body)
  },
  forgotPassword(body: { email: string }) {
    return http.post<{ message: string }>(URL_FORGOT_PASSWORD, body)
  },
  resetPassword(body: { forgot_password_token: string; password: string; confirm_password: string }) {
    return http.post<{ message: string }>(URL_RESET_PASSWORD, body)
  }
}

export default authApi

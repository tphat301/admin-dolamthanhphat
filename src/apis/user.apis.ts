import { User } from '../types/auth.types'
import { SuccessResponseApi } from '../types/utils.types'
import http from '../utils/http'

const URL = 'admin-account'

type UpdateProfile = Pick<User, 'address' | 'name' | 'phone' | 'date_of_birth' | 'avatar'>

const userApi = {
  getProfile() {
    return http.get<SuccessResponseApi<User>>(`${URL}/me`)
  },
  updateProfile(body: UpdateProfile) {
    return http.patch<SuccessResponseApi<User>>(`${URL}/me`, body)
  },
  changePassword(body: { old_password: string; password: string; confirm_password: string }) {
    return http.post<{ message: string }>(`${URL}/change-password`, body)
  },
  uploadAvatar(body: FormData) {
    return http.post<
      SuccessResponseApi<{
        data: {
          name: string
          domain: string
          type: string
        }
      }>
    >(`${URL}/upload-avatar`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi

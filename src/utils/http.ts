import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import CONFIG from '../constants/config'
import { httpStatusCode } from '../constants/httpStatusCode'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auths'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from '../apis/auth.apis'
import { AuthSuccessResponeApi, RefreshTokenReponse } from '../types/auth.types'
import { toast } from 'sonner'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './commons'
import { ErrorResponseApi } from '../types/utils.types'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthSuccessResponeApi
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS(data.data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        // Không phải lỗi 422 và 401 mới toast
        if (
          ![httpStatusCode.UnprocessableEntity, httpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error('Alert Error', {
            description: message,
            action: {
              label: 'Đóng',
              onClick: () => true
            },
            duration: 4000,
            position: 'top-right'
          })
        }
        // Xử lý lỗi 401
        if (isAxiosUnauthorizedError<ErrorResponseApi<{ name: string; message: string }>>(error)) {
          const config = error.response?.config
          const url = config?.url
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              if (config?.headers) config.headers.authorization = access_token
              return this.instance({
                ...config,
                headers: { ...(config as InternalAxiosRequestConfig<any>).headers, authorization: access_token }
              })
            })
          }
          // Những trường hợp không đúng token
          // Không truyền token
          // Gọi refresh token thất bại
          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error('Alert Error', {
            description: error.response?.data.data?.message || error.response?.data.message,
            action: {
              label: 'Đóng',
              onClick: () => true
            },
            duration: 4000,
            position: 'top-right'
          })
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}
const http = new Http().instance
export default http

import axios, { AxiosError } from 'axios'
import { httpStatusCode } from '../constants/httpStatusCode'
import CONFIG from '../constants/config'
import { ErrorResponseApi } from '../types/utils.types'

export function isAxiosError<TypeError>(error: unknown): error is AxiosError<TypeError> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<UnprocessableEntityError>(
  error: unknown
): error is AxiosError<UnprocessableEntityError> {
  return isAxiosError(error) && error.response?.status === httpStatusCode.UnprocessableEntity
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === httpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<ExpiredTokenError>(error: unknown): error is AxiosError<ExpiredTokenError> {
  return (
    isAxiosUnauthorizedError<ErrorResponseApi<{ name: string; message: string }>>(error) &&
    error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}

export function slugify(str: string) {
  return str
    .normalize('NFD') // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // loại bỏ ký tự đặc biệt
    .replace(/\s+/g, '-') // thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-') // bỏ gạch ngang liên tiếp
}
export function fullUrlImage(imageName: string, type = 'image') {
  return imageName ? CONFIG.BASE_URL + type + '/' + imageName : ''
}

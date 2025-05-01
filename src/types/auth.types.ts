import { SuccessResponseApi } from './utils.types'

export interface User {
  _id: string
  email: string
  address?: string
  name?: string
  phone?: string
  date_of_birth?: string
  created_at?: string
  updated_at?: string
  verify?: number
  avatar?: string
}

export type AuthSuccessResponeApi = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  expires_access_token: number
  expires_refresh_token: number
  user: User
}>

export type RefreshTokenReponse = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  user: User
}>

import { Service, Services } from '../types/service.types'
import { SuccessResponseApi } from '../types/utils.types'
import http from '../utils/http'

interface CreateServiceReqBody {
  title: string
  image?: string
  description?: string
}

interface UpdateServiceReqBody {
  id: string
  title?: string
  image?: string
  description?: string
}

const URL = 'admin/services'

const serviceApi = {
  getServiceDetail(id: string) {
    return http.get<SuccessResponseApi<Service>>('services/detail/' + id)
  },
  getServices(params: { limit?: string; page?: string }) {
    return http.get<SuccessResponseApi<Services>>(URL, { params })
  },
  createService(body: CreateServiceReqBody) {
    return http.post<SuccessResponseApi<Service>>(URL, body)
  },
  updateService(body: UpdateServiceReqBody) {
    return http.patch<SuccessResponseApi<Service>>(URL, body)
  },
  deleteService(data: { ids: string[] }) {
    return http.delete<{ message: string }>(URL, {
      data
    })
  },
  uploadImageService(body: FormData) {
    return http.post<
      SuccessResponseApi<{
        name: string
        domain: string
        type: string
      }>
    >(`${URL}/upload-image`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default serviceApi

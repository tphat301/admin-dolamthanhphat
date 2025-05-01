import { About } from '../types/about.types'
import { SuccessResponseApi } from '../types/utils.types'
import http from '../utils/http'

interface CreateAboutReqBody {
  title: string
  image?: string
  description?: string
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
}

interface UpdateAboutReqBody {
  id: string
  title?: string
  image?: string
  description?: string
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
}

const aboutApi = {
  getAbout() {
    return http.get<SuccessResponseApi<About>>('about')
  },
  createAbout(body: CreateAboutReqBody) {
    return http.post<SuccessResponseApi<About>>('admin/about', body)
  },
  updateAbout(body: UpdateAboutReqBody) {
    return http.put<SuccessResponseApi<About>>('admin/about', body)
  },
  uploadImageAbout(body: FormData) {
    return http.post<
      SuccessResponseApi<{
        name: string
        domain: string
        type: string
      }>
    >('admin/about/upload-image', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default aboutApi

import { Blog, Blogs } from '../types/blog.types'
import { SuccessResponseApi } from '../types/utils.types'
import http from '../utils/http'

interface CreateBlogReqBody {
  slug: string
  title: string
  image?: string
  description?: string
  content?: string
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
}

interface UpdateBlogReqBody {
  id: string
  slug?: string
  title?: string
  image?: string
  description?: string
  content?: string
  seo_title?: string
  seo_keywords?: string
  seo_description?: string
}

const URL = 'admin/blogs'

const blogApi = {
  getBlogDetail(id: string) {
    return http.get<SuccessResponseApi<Blog>>('blogs/detail/' + id)
  },
  getBlogs(params: { limit?: string; page?: string }) {
    return http.get<SuccessResponseApi<Blogs>>(URL, { params })
  },
  createBlog(body: CreateBlogReqBody) {
    return http.post<SuccessResponseApi<Blog>>(URL, body)
  },
  updateBlog(body: UpdateBlogReqBody) {
    return http.patch<SuccessResponseApi<Blog>>(URL, body)
  },
  deleteBlog(data: { ids: string[] }) {
    return http.delete<{ message: string }>(URL, {
      data
    })
  },
  uploadImageBlog(body: FormData) {
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

export default blogApi

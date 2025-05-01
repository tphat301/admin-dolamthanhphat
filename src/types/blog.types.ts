export interface Blog {
  _id: string
  image: string
  slug: string
  title: string
  description: string
  content: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  created_at: Date
  updated_at: Date
}

export interface Blogs {
  blogs: Blog[]
  limit: number
  page: number
  total_page: number
}

export interface ExtendedBlogs extends Blog {
  checked: boolean
}

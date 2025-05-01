export interface Service {
  _id: string
  image: string
  title: string
  description: string
  created_at: Date
  updated_at: Date
}

export interface Services {
  services: Service[]
  limit: number
  page: number
  total_page: number
}

export interface ExtendedServices extends Service {
  checked: boolean
}

export interface Product {
  id: number
  name: string
  description: string
  precioGeneral: number
  imagenes: Array<{ id: number; url: string }>
  categoria: string
}

export interface User {
  id: number
  email: string
  role: "user" | "mipyme"
}

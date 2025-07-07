"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { BACKEND } from "@/types/url"

interface Usuario {
  id: number
  username: string
  email: string
  rol: {
    id: number
    rol_name: string
  }
  metodos: string
}

interface AuthContextType {
  user: Usuario | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isVendedor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND}token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.access)
        setUser(data.user)
        localStorage.setItem("token", data.access)
        localStorage.setItem("user", JSON.stringify(data.user))
        return true
      }
      return false
    } catch (error) {
      console.error("Error en login:", error)
      return false
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND}auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      return response.ok
    } catch (error) {
      console.error("Error en registro:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const isAuthenticated = !!user && !!token
  const isVendedor = user?.rol?.id === 2

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        isVendedor,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

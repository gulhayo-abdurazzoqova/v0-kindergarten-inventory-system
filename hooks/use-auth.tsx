"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)

      // For demo purposes, use mock authentication
      const mockUsers = {
        "admin@kindergarten.edu": { id: 1, name: "Dr. Emily Davis", email: "admin@kindergarten.edu", role: "admin" },
        "manager@kindergarten.edu": {
          id: 2,
          name: "Sarah Johnson",
          email: "manager@kindergarten.edu",
          role: "manager",
        },
        "cook@kindergarten.edu": { id: 3, name: "Mike Chen", email: "cook@kindergarten.edu", role: "cook" },
      }

      const mockPasswords = {
        "admin@kindergarten.edu": "admin123",
        "manager@kindergarten.edu": "manager123",
        "cook@kindergarten.edu": "cook123",
      }

      if (
        mockUsers[email as keyof typeof mockUsers] &&
        mockPasswords[email as keyof typeof mockPasswords] === password
      ) {
        const userData = mockUsers[email as keyof typeof mockUsers]
        const token = "mock-token-" + Date.now()

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
      } else {
        throw new Error("Invalid credentials")
      }

      // Real API call would look like:
      // const response = await fetch("/api/token", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
      //   body: `username=${email}&password=${password}`
      // })

      // if (!response.ok) {
      //   throw new Error("Invalid credentials")
      // }

      // const data = await response.json()
      // localStorage.setItem("token", data.access_token)
      // localStorage.setItem("user", JSON.stringify(data.user))
      // setUser(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

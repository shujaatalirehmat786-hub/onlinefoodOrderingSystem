"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { setAuthToken, removeAuthToken, setUser, getUser, isAuthenticated, type User } from "@/lib/auth"

export function useAuth() {
  const [user, setUserState] = useState<User | null>(() => getUser())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in on mount
    if (isAuthenticated() && !user) {
      fetchProfile()
    }
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await api.profile.get()
      const userData = response.data || response
      setUser(userData)
      setUserState(userData)
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching profile:", err)
      setError("Failed to fetch profile")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (phone: string) => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("[v0] Attempting login with phone:", phone)
      const response = await api.auth.login(phone)
      console.log("[v0] Login response:", response)

      const token = response?.token || response?.data?.token || response?.data?.accessToken || response?.accessToken
      const userData = response?.user || response?.data?.user || response?.data

      console.log("[v0] Extracted token:", token ? "Token received" : "No token")
      console.log("[v0] Extracted user:", userData)

      if (token) {
        setAuthToken(token)
        if (userData) {
          setUser(userData)
          setUserState(userData)
        } else {
          // Fetch profile after login
          await fetchProfile()
        }
        return true
      } else {
        console.error("[v0] No token in response. Full response:", JSON.stringify(response))
        throw new Error("No token received")
      }
    } catch (err: any) {
      console.error("[v0] Login error:", err)
      setError(err.message || "Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    removeAuthToken()
    setUserState(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.profile.update(data)
      const userData = response.data || response
      setUser(userData)
      setUserState(userData)
      return true
    } catch (err: any) {
      console.error("[v0] Update profile error:", err)
      setError(err.message || "Failed to update profile")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
  }
}

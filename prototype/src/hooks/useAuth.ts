import { useState, useEffect } from 'react'

const ADMIN_PASSWORD_KEY = 'gmci_admin_logged_in'
const ADMIN_PASSWORD = 'gmci2026'

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) === 'true'
  })

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(ADMIN_PASSWORD_KEY, 'true')
    } else {
      localStorage.removeItem(ADMIN_PASSWORD_KEY)
    }
  }, [isLoggedIn])

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
  }

  return {
    isLoggedIn,
    login,
    logout,
  }
}

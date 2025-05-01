import { createContext, useState } from 'react'
import { getAccessTokenFromLS, getProfileFromLS } from '../utils/auths'
import { User } from '../types/auth.types'

interface AppContext {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
}

const initialAppContext: AppContext = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContext>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }
  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, reset }}>
      {children}
    </AppContext.Provider>
  )
}

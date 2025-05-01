import { useContext, useEffect } from 'react'
import './App.css'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/sonner'
import useRouteElements from './hooks/useRouteElements'
import { eventTargetLS } from './utils/auths'
import { AppContext } from './contexts/app.context'

function App() {
  const elementRoute = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    eventTargetLS.addEventListener('clearLS', reset)
    return () => {
      eventTargetLS.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <div>
      <Toaster />
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        {elementRoute}
      </ThemeProvider>
    </div>
  )
}

export default App

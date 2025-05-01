import { Outlet } from 'react-router-dom'
import Menu from '../../components/Menu'
import { SidebarProvider } from '../../components/ui/sidebar'
import Header from '../../components/Header'

const MainLayout = () => {
  return (
    <div>
      <main>
        <SidebarProvider>
          <Menu />
          <div className='w-full'>
            <Header />
            <Outlet />
          </div>
        </SidebarProvider>
      </main>
    </div>
  )
}

export default MainLayout

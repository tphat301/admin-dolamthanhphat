import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { SidebarTrigger } from '../../components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu'
import { Button } from '../../components/ui/button'
import { User, Settings, LogOut } from 'lucide-react'
import { AppContext } from '../../contexts/app.context'
import authApi from '../../apis/auth.apis'
import { getRefreshTokenFromLS } from '../../utils/auths'
import PATH from '../../constants/path'

const Header = () => {
  const { profile, setProfile, setIsAuthenticated } = useContext(AppContext)
  const refresh_token = getRefreshTokenFromLS()
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout({ refresh_token }),
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }
  return (
    <div className='w-full'>
      <div className='flex justify-between w-[calc(100%-20px)] mx-auto items-center py-2 '>
        <SidebarTrigger />
        <DropdownMenu>
          <div className='flex justify-end'>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <User className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <User className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span className='sr-only'>Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <User />
                {profile ? profile.email : 'admin@gmail.com'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                <Link to={PATH.CHANGE_PASSWORD}>Change Password</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut />
                <button onClick={handleLogout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </div>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Header

import { Home, Settings, Newspaper } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '../ui/sidebar'
import PATH from '../../constants/path'
import { NavLink, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const items = [
  {
    title: 'Dashboard',
    url: PATH.DASHBOARD,
    icon: Home
  },
  {
    title: 'Blogs',
    url: PATH.BLOGS,
    icon: Newspaper
  },
  {
    title: 'About',
    url: PATH.ABOUT,
    icon: Newspaper
  },
  {
    title: 'Service',
    url: PATH.SERVICES,
    icon: Newspaper
  },
  {
    title: 'Profile',
    url: PATH.PROFILE,
    icon: Settings
  }
]

const Menu = () => {
  const location = useLocation()
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={clsx(location.pathname === item.url ? 'text-red-500' : 'text-black')}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default Menu

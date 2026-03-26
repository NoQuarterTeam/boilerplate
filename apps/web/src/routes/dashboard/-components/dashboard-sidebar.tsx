import { getRouteApi, Link } from "@tanstack/react-router"
import { CircleUserIcon, LayoutDashboardIcon, ListTodoIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@boilerplate/ui/components/sidebar"

const appNav = [
  { to: "/dashboard" as const, label: "Overview", icon: LayoutDashboardIcon, exact: true },
  { to: "/dashboard/todos" as const, label: "Todos", icon: ListTodoIcon, exact: false },
]

const adminNav = [{ to: "/dashboard/users" as const, label: "Users", icon: CircleUserIcon, exact: false }]

const dashboard = getRouteApi("/dashboard")

export function DashboardSidebar() {
  const { user } = dashboard.useRouteContext()

  const { isMobile, setOpenMobile } = useSidebar()

  const handleNavigationLinkClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="flex h-16 min-w-0 justify-center overflow-hidden px-4 pt-2 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:px-2">
        <Link
          to="/dashboard"
          onClick={handleNavigationLinkClick}
          className="block max-w-full min-w-0 ring-sidebar-ring outline-none focus-visible:ring-2"
        >
          <span className="text-xl font-bold tracking-tight">Boilerplate</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appNav.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    render={
                      <Link
                        to={item.to}
                        className="opacity-50 data-[status=active]:bg-muted data-[status=active]:opacity-100"
                        activeOptions={{ exact: item.exact }}
                        onClick={handleNavigationLinkClick}
                      />
                    }
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user.isAdmin ? (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNav.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      render={
                        <Link
                          to={item.to}
                          className="opacity-50 data-[status=active]:bg-muted data-[status=active]:opacity-100"
                          activeOptions={{ exact: item.exact }}
                          onClick={handleNavigationLinkClick}
                        />
                      }
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
    </Sidebar>
  )
}

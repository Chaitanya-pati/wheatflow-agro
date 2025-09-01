import { useState } from "react"
import { 
  Truck, 
  FlaskConical, 
  Scale, 
  Warehouse, 
  Factory, 
  Package, 
  ShoppingCart,
  BarChart3,
  Settings,
  Home,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Cog
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    group: "main"
  },
  { 
    title: "Gate Entry", 
    url: "/gate-entry", 
    icon: Truck,
    group: "operations"
  },
  { 
    title: "Quality Control", 
    url: "/quality-control", 
    icon: FlaskConical,
    group: "operations"
  },
  { 
    title: "Weight Management", 
    url: "/weight-management", 
    icon: Scale,
    group: "operations"
  },
  { 
    title: "Godown Management", 
    url: "/godown-management", 
    icon: Warehouse,
    group: "inventory"
  },
  { 
    title: "Pre-Cleaning", 
    url: "/pre-cleaning", 
    icon: Factory,
    group: "production"
  },
  { 
    title: "Production Orders", 
    url: "/production-orders", 
    icon: Target,
    group: "production"
  },
  { 
    title: "Production Process", 
    url: "/production-process", 
    icon: Cog,
    group: "production"
  },
  { 
    title: "Finished Goods", 
    url: "/finished-goods", 
    icon: Package,
    group: "production"
  },
  { 
    title: "Sales Orders", 
    url: "/sales-orders", 
    icon: ShoppingCart,
    group: "sales"
  },
  { 
    title: "Dispatch", 
    url: "/dispatch", 
    icon: Truck,
    group: "sales"
  },
  { 
    title: "Reports", 
    url: "/reports", 
    icon: BarChart3,
    group: "reports"
  },
  { 
    title: "Masters", 
    url: "/masters", 
    icon: Settings,
    group: "config"
  },
  { 
    title: "Users", 
    url: "/users", 
    icon: Users,
    group: "config"
  },
]

const groupLabels = {
  main: "Overview",
  operations: "Gate Operations",
  inventory: "Inventory",
  production: "Production",
  sales: "Sales & Dispatch", 
  reports: "Analytics",
  config: "Configuration"
}

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-primary" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

  const groupedItems = Object.entries(
    menuItems.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = []
      }
      acc[item.group].push(item)
      return acc
    }, {} as Record<string, typeof menuItems>)
  )

  return (
    <Sidebar 
      className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"} border-r border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center">
            <Factory className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Mill Manager</h1>
              <p className="text-xs text-sidebar-foreground/70">Warehouse System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {groupedItems.map(([groupKey, items]) => (
          <SidebarGroup key={groupKey} className="py-2">
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium uppercase tracking-wider px-3 py-2">
                {groupLabels[groupKey as keyof typeof groupLabels]}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavCls({ isActive: isActive(item.url) })}
                      >
                        <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
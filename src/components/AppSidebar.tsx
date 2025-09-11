import { 
  Home, 
  Users, 
  ClipboardList, 
  Scale, 
  Package, 
  FileText, 
  Settings, 
  Truck,
  Cog,
  FlaskConical,
  Workflow,
  Target,
  BarChart3,
  ShoppingCart,
  Factory,
  Warehouse
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

// Menu items grouped by function
const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
    badge: null
  },
  {
    title: "Operations",
    items: [
      {
        title: "Gate Entry",
        icon: Truck,
        url: "/gate-entry",
      },
      {
        title: "Quality Control",
        icon: FlaskConical,
        url: "/quality-control",
      },
      {
        title: "Pre-Cleaning",
        icon: Factory,
        url: "/pre-cleaning",
      },
      {
        title: "Production Orders",
        icon: Target,
        url: "/production-orders",
      },
      {
        title: "Production Workflow",
        icon: Workflow,
        url: "/production-workflow",
      },
      {
        title: "Production Process",
        icon: Cog,
        url: "/production-process",
      },
      {
        title: "Weight Management",
        icon: Scale,
        url: "/weight-management",
      },
      {
        title: "Finished Goods",
        icon: Package,
        url: "/finished-goods",
      },
      {
        title: "Dispatch",
        icon: Truck,
        url: "/dispatch",
      }
    ]
  },
  {
    title: "Management",
    items: [
      {
        title: "Godown Management",
        icon: Warehouse,
        url: "/godown-management",
      },
      {
        title: "Sales Orders",
        icon: ShoppingCart,
        url: "/sales-orders",
      },
      {
        title: "Reports",
        icon: BarChart3,
        url: "/reports",
      },
      {
        title: "Masters",
        icon: ClipboardList,
        url: "/masters",
      },
      {
        title: "Users",
        icon: Users,
        url: "/users",
      }
    ]
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 p-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Factory className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Mill Management</span>
            <span className="text-xs text-muted-foreground">System v2.0</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((section, index) => (
          <SidebarGroup key={index}>
            {section.title && section.items ? (
              <>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={item.url}>
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={section.url || "/"}>
                        <section.icon className="w-4 h-4" />
                        <span>{section.title}</span>
                        {section.badge && (
                          <Badge variant="outline" className="ml-auto">
                            {section.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
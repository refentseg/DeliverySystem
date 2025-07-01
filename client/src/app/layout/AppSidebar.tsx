import { Home, Truck, Users, ShoppingBag, Package } from "lucide-react"
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
    SidebarRail,
    useSidebar } from "../components/ui/sidebar"
import { useLocation} from "react-router-dom";

const initialItems = [
  {
    title: "Home",
    url: "/",
    icon: Home
  },
  {
    title: "Deliveries",
    url: "/deliveries",
    icon: Package
  },
  {
    title: "Drivers",
    url: "/drivers",
    icon: Truck
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
]


export default function AppSideBar() {
  const { isMobile } = useSidebar()

  const location = useLocation();

  // Create items with dynamic isActive property
  const items = initialItems.map(item => ({
    ...item,
    isActive: item.url === location.pathname
  }));

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"}>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-lg"></span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
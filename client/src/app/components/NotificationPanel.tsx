import { Bell} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";


export default function NotificationPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-accent">
            <Avatar className="h-9 w-9">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">New delivery assigned</p>
              <p className="text-sm text-muted-foreground">John Doe has been assigned to delivery #12345</p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-accent">
            <Avatar className="h-9 w-9">
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">Delivery completed</p>
              <p className="text-sm text-muted-foreground">Delivery #12340 has been completed successfully</p>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-accent">
            <Avatar className="h-9 w-9">
              <AvatarFallback>EW</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">New customer registered</p>
              <p className="text-sm text-muted-foreground">Emily Wilson has registered as a new customer</p>
              <p className="text-xs text-muted-foreground">3 hours ago</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
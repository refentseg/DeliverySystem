import { MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function MessagePanel(){
    return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <MessageSquare className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
            2
          </Badge>
          <span className="sr-only">Messages</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Messages</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-accent">
            <Avatar className="h-9 w-9">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-sm text-muted-foreground">I'll be 10 minutes late for the delivery</p>
              <p className="text-xs text-muted-foreground">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-accent">
            <Avatar className="h-9 w-9">
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">Alex Thompson</p>
              <p className="text-sm text-muted-foreground">Customer not available at the address</p>
              <p className="text-xs text-muted-foreground">30 minutes ago</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import type { Job } from "@/app/models/job"
import { ArrowRight, CheckCircle, Edit, EllipsisVertical, Trash2, Truck } from "lucide-react"

interface Props {
  jobs: Job[]
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Pending
        </Badge>
      )
    case "assigned":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Assigned
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          In Progress
        </Badge>
      )
    case "delivered":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Delivered
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function JobList({jobs}:Props) {
  return (
      <div className="w-full">
      {/* Mobile Card View - shown on small screens */}
      <div className="block md:hidden space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">No deliveries found</p>
            <p className="text-sm text-muted-foreground mt-1">Your delivery jobs will appear here</p>
          </div>
        ) : (
          jobs.map((delivery) => (
            <div key={delivery.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Header with ID, Date and Actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg text-gray-900">#{delivery.id}</span>
                    {getStatusBadge(delivery.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(delivery.scheduled_time).toLocaleDateString("en-ZA", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                      <span className="sr-only">Open menu</span>
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => console.log(`Mark ${delivery.id} as complete`)}
                      disabled={delivery.status === "delivered" || delivery.status === "cancelled"}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => console.log(`Edit ${delivery.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => console.log(`Delete ${delivery.id}`)} 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Customer and Driver Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer</div>
                  <div className="font-medium text-gray-900 truncate">{delivery.customer.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Driver</div>
                  <div className="font-medium text-gray-900 truncate">{delivery.driver.name}</div>
                </div>
              </div>

              {/* Route Information */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Route</div>
                
                <div className="flex items-center gap-2 py-1">
                  {/* From Location */}
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 font-medium text-xs"
                    >
                      {delivery.delivery_from}
                    </Badge>
                  </div>
                  {/* Arrow with Truck Icon */}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ArrowRight className="w-3 h-3" />
                    <Truck className="w-3 h-3" />
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  {/* To Location */}
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs"
                    >
                      {delivery.destination}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Additional Info Footer */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {new Date(delivery.scheduled_time).toLocaleTimeString("en-ZA", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
                {delivery.priority && (
                  <Badge variant="secondary" className="text-xs">
                    {delivery.priority}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Desktop Table View - shown on medium screens and up */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of scheduled deliveries and their current status.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-left">ID</TableHead>
                <TableHead className="text-left">Customer</TableHead>
                <TableHead className="text-left hidden lg:table-cell">Driver</TableHead>
                <TableHead className="text-left hidden xl:table-cell">Scheduled Delivery</TableHead>
                <TableHead className="text-left">Destination</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium text-left">#{delivery.id}</TableCell>
                    <TableCell className="text-left">
                      <div>
                        <div>{delivery.customer.name}</div>
                        <div className="text-xs text-muted-foreground lg:hidden">Driver: {delivery.driver.name}</div>
                        <div className="text-xs text-muted-foreground xl:hidden">
                          {new Date(delivery.scheduled_time).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-left hidden lg:table-cell">{delivery.driver.name}</TableCell>
                    <TableCell className="text-left hidden xl:table-cell">
                      {new Date(delivery.scheduled_time).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 py-1">
                        {/* From Location */}
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 font-medium text-xs"
                          >
                            {delivery.delivery_from}
                          </Badge>
                        </div>

                        {/* Arrow with Truck Icon */}
                        <div className="flex items-center gap-1 text-muted-foreground justify-center lg:justify-start">
                          <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
                          <Truck className="w-3 h-3" />
                          <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
                        </div>

                        {/* To Location */}
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs"
                          >
                            {delivery.destination}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getStatusBadge(delivery.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => console.log(`Mark ${delivery.id} as complete`)}
                            disabled={delivery.status === "delivered" || delivery.status === "cancelled"}
                          >
                            Mark as Delivered
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => console.log(`Edit ${delivery.id}`)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => console.log(`Delete ${delivery.id}`)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
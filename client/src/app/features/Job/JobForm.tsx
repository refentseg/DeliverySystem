import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/components/ui/command"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { cn } from "@/app/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

const existingCustomers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+27 123 456 789" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+27 987 654 321" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+27 555 123 456" },
]

const drivers = [
  { id: 1, name: "David Wilson", license: "DL001" },
  { id: 2, name: "Sarah Brown", license: "DL002" },
  { id: 3, name: "Tom Anderson", license: "DL003" },
]

export default function DeliveryForm() {
  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [driverOpen, setDriverOpen] = useState(false)

  const [formData, setFormData] = useState({
    delivery_from: "Mooiplaas",
    destination: "Midrand",
    status: "pending",
    priority: "medium",
    scheduled_time: "2025-06-06T18:00",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const deliveryData = {
      delivery_from: formData.delivery_from,
      destination: formData.destination,
      status: formData.status,
      priority: formData.priority,
      scheduled_time: new Date(formData.scheduled_time).toISOString(),
      customer_id: isExistingCustomer ? selectedCustomer : null,
      driver_id: selectedDriver,
      ...(isExistingCustomer
        ? {}
        : {
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
          }),
    }

    console.log("Delivery Data:", deliveryData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Delivery Order</CardTitle>
        <CardDescription>Fill in the details for the new delivery order</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="existing-customer"
                checked={isExistingCustomer}
                onCheckedChange={(checked) => {
                  setIsExistingCustomer(checked as boolean)
                  setSelectedCustomer(null)
                }}
              />
              <Label htmlFor="existing-customer" className="text-sm font-medium">
                Existing Customer
              </Label>
            </div>

            {isExistingCustomer ? (
              <div className="space-y-2">
                <Label>Select Customer</Label>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={customerOpen}
                      className="w-full justify-between"
                    >
                      {selectedCustomer
                        ? existingCustomers.find((customer) => customer.id === selectedCustomer)?.name
                        : "Select customer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search customers..." />
                      <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          {existingCustomers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.name}
                              onSelect={() => {
                                setSelectedCustomer(customer.id)
                                setCustomerOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCustomer === customer.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-sm text-muted-foreground">{customer.email}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange("customer_name", e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => handleInputChange("customer_email", e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    value={formData.customer_phone}
                    onChange={(e) => handleInputChange("customer_phone", e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Driver Section */}
          <div className="space-y-2">
            <Label>Select Driver</Label>
            <Popover open={driverOpen} onOpenChange={setDriverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={driverOpen} className="w-full justify-between">
                  {selectedDriver ? drivers.find((driver) => driver.id === selectedDriver)?.name : "Select driver..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search drivers..." />
                  <CommandList>
                    <CommandEmpty>No driver found.</CommandEmpty>
                    <CommandGroup>
                      {drivers.map((driver) => (
                        <CommandItem
                          key={driver.id}
                          value={driver.name}
                          onSelect={() => {
                            setSelectedDriver(driver.id)
                            setDriverOpen(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", selectedDriver === driver.id ? "opacity-100" : "opacity-0")}
                          />
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-muted-foreground">License: {driver.license}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-from">Delivery From</Label>
              <Input
                id="delivery-from"
                value={formData.delivery_from}
                onChange={(e) => handleInputChange("delivery_from", e.target.value)}
                placeholder="Enter pickup location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                placeholder="Enter destination"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled-time">Scheduled Time</Label>
            <Input
              id="scheduled-time"
              type="datetime-local"
              value={formData.scheduled_time}
              onChange={(e) => handleInputChange("scheduled_time", e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Delivery Order
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
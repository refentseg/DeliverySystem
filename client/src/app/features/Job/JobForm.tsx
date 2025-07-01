import agent from "@/app/api/agent"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/components/ui/command"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { cn, formatForDateTimeLocal, getTodayAt18 } from "@/app/lib/utils"
import type { Job } from "@/app/models/job"
import { useAppDispatch } from "@/app/Store/configureStore"
import { Check, ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, type FieldValues } from "react-hook-form";
import { setJob } from "./JobSlice"
import UseJobs from "@/app/hooks/UseJobs"

interface Props{
    job?:Job;
    cancelEdit:() => void;
}

export default function DeliveryForm({job, cancelEdit}: Props) {
  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [driverOpen, setDriverOpen] = useState(false)

  const { control,register, reset, handleSubmit, formState:{isDirty,isSubmitting} } = useForm({
    defaultValues:{
      delivery_from: job?.delivery_from || "Mooiplaas",
      destination: job?.destination || "Midrand",
      status: job?.status || "pending",
      priority: job?.priority || "medium",
      scheduled_time: job?.scheduled_time
    ? formatForDateTimeLocal(job.scheduled_time)
    : getTodayAt18() ,
      customer_name: job?.customer?.name || "",
      customer_email: job?.customer?.email || "",
      customer_phone: job?.customer?.phone || "",
    }
   });
   const dispatch = useAppDispatch();

   const {drivers, customers} = UseJobs();

  useEffect(()=>{
    if(job && isDirty) reset(job)
  })

  async function handleSubmitData(data:any) {
   try{
    const submissionData = {
        ...data,
        ...(job && { id: job.id }),
        customer_id: isExistingCustomer ? selectedCustomer : null,
        driver_id: selectedDriver,
      };
    let response : Job;
    if(job){
      response = await agent.Job.updateJob(submissionData);
    }else{
      response = await agent.Job.createJob(submissionData);
      console.log(response)
    }
    dispatch(setJob(response));
    cancelEdit();
   }catch(error){
     console.log("Error creating/edit delivery order:", error)
   }
  }
  return (
    <Card className="w-full max-w-2xl mx-auto mt-5 mb-5">
      <CardHeader>
        <CardTitle>Create Delivery Order</CardTitle>
        <CardDescription>Fill in the details for the new delivery order</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleSubmitData)} className="space-y-6">
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
                        ? customers.find((customer) => customer.id === selectedCustomer)?.name
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
                          {customers.map((customer) => (
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
                    
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="Enter email address"
                    {...register("customer_name", { required: "Customer name is required" })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    {...register("customer_phone", { required: "Customer phone is required" })}
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
                {...register("delivery_from", { required: "Delivery From is required" })}
                placeholder="Enter pickup location"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                {...register("destination", { required: "Destination is required" })}
                placeholder="Enter destination"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select {...register("status", { required: "Status name is required" })}>
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
              <Select {...register("priority", { required: "Priority required" })}>
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
              {...register("scheduled_time", { required: "Scheduled Time is required" })}
              required
            />
          </div>
          <Button type="button" variant="outline" onClick={cancelEdit} className="w-full">
            Cancel
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {job ? "Edit Delivery Order":"Create Delivery Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
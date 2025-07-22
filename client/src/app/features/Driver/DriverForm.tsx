import agent from "@/app/api/agent";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import type { Driver } from "@/app/models/driver";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { driverSchema, type DriverFormData } from "./DriverSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props{
    driver?:Driver;
    cancelEdit: () => void;
}
export default function DriverForm({driver, cancelEdit}: Props) {
    const { control, register, reset, handleSubmit, formState: { errors, isDirty, isSubmitting } } = useForm<DriverFormData>({
        resolver: zodResolver(driverSchema),
        defaultValues: driver || {
            name: '',
            email: '',
            phone: '',
            license_number: ''
        }
    });

    async function handleSubmitData(data: any) {
        if (driver) {
            // Update existing driver
            await agent.Driver.updateDriver({ ...data, id: driver.id });
        } else {
            // Create new driver
            await agent.Driver.createDriver(data);
        }
        cancelEdit();
    }

    // Reset form when driver changes or isDirty state changes
    useEffect(() => {
        if (driver && isDirty) {
            reset(driver);
        }
    }, [driver, isDirty, reset]); 

    return(
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Driver Information</CardTitle>
        <CardDescription>Please provide driver details and license information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(handleSubmitData)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="driver-name">Full Name</Label>
            <Input 
              id="driver-name" 
              type="text" 
              placeholder="Enter full name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-email">Email Address</Label>
            <Input 
              id="driver-email" 
              type="email" 
              placeholder="Enter email address"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-phone">Phone Number</Label>
            <Input 
              id="driver-phone" 
              type="tel" 
              placeholder="Enter phone number"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="license-number">License Number</Label>
            <Input 
              id="license-number" 
              type="text" 
              placeholder="Enter driver's license number"
              {...register('license_number')}
            />
            {errors.license_number && (
              <p className="text-sm text-red-600">{errors.license_number.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 bg-transparent"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {driver ? "Update Driver" : "Add Driver"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
import agent from "@/app/api/agent";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { customerSchema, type CustomerFormData } from "./CustomerSchema";
import { zodResolver } from '@hookform/resolvers/zod';

interface Props{
    customer: any; // Replace with actual type
    cancelEdit: () => void;
}
export default function CustomerForm({customer, cancelEdit}: Props) {
    const { control,register, reset, handleSubmit, formState:{errors, isDirty, isSubmitting} } = useForm<CustomerFormData>({
        resolver:zodResolver(customerSchema),
        defaultValues: customer || {
            name: '',
            email: '',
            phone: ''
        }
    })

    useEffect(() => {
        if (customer && isDirty) {
            reset(customer);
        }
    }, [customer]);


    async function handleSubmitData(data:any){
        try{
            if (customer) {
            // Update existing customer
            await agent.Customer.updateCustomer({ ...data, id: customer.id });
        } else {
            // Create new customer
            await agent.Customer.createCustomer(data);
        }
        cancelEdit();
        }catch (error) {
            console.error("Error submitting customer data:", error);   
        }
        
    }

    return(
      <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>Please fill out Customer Information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(handleSubmitData)} className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Enter your full name" required
            {...register('name', {required: 'Name is required'}) }/>
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            
            </div>
            <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email address" required
            {...register('email', {required: 'Email is required'})}/>
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" required 
            {...register('phone', {required: 'Phone is required'})}/>
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 bg-transparent"
                    onClick={cancelEdit}>
                    Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {customer ? "Update Customer" : "Add Customer"}
                </Button>
            </div>
        </form>
      </CardContent>
    </Card>  
    )
}


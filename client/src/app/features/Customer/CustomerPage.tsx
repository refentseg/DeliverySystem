import UseJobs from "@/app/hooks/UseJobs";
import { useState } from "react";
import agent from "@/app/api/agent";
import { useAppDispatch } from "@/app/Store/configureStore";
import { removeCustomer } from "./CustomerSlice";
import CustomerList from "./CustomerList";
import type { Customer } from "@/app/models/customer";
import CustomerForm from "./CustomerForm";
import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";

export default function CustomerPage() {
    const { customers} = UseJobs();
     const dispatch = useAppDispatch();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
    const [editMode, setEditMode] = useState(false);
    const [target,setTarget] = useState(0);

    function cancelEdit() {
        if (selectedCustomer) setSelectedCustomer(undefined);
        setEditMode(false);
    }

    function handleSelectCustomer(customer: Customer) {
        setSelectedCustomer(customer);
        setEditMode(true);
    }

    function handleDeleteCustomer(id: number) {
        setTarget(id);
        agent.Customer.deleteCustomer(id)
            .then(() => {
                // Dispatch an action to remove the customer from the store
                dispatch(removeCustomer(id));
            })
            .catch(error => console.log(error));
    }
    if(editMode)return <CustomerForm customer={selectedCustomer} cancelEdit={cancelEdit} />
    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <div></div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setEditMode(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>
            <CustomerList 
                customers={customers} 
                onSelectCustomer={handleSelectCustomer} 
                onDeleteCustomer={handleDeleteCustomer}/>
        </div>
    );
}
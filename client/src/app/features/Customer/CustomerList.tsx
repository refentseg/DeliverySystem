import { Button } from "@/app/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import type { Customer } from "@/app/models/customer";
import { EllipsisVertical } from "lucide-react";

interface Props {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: number) => void;
}

export default function CustomerList({customers, onSelectCustomer, onDeleteCustomer}:Props)
{
    return(
        <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No customers found
                  </TableCell>
                </TableRow>
                ):(
                customers.map(customer => (
                    <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                            <button onClick={() => onSelectCustomer(customer)}>Select</button>
                            <button onClick={() => onDeleteCustomer(customer.id)}>Delete</button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <EllipsisVertical className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onSelectCustomer(customer)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => console.log(`Delete ${customer.id}`)}
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
    )
}
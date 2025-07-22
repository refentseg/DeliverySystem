import { Button } from "@/app/components/ui/button";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import type { Driver } from "@/app/models/driver";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical } from "lucide-react";

interface Props{
    drivers: Driver[];
    onSelectDriver: (driver: Driver) => void;
    onDeleteDriver: (id: number) => void;
}
export default function DriverList({drivers, onSelectDriver, onDeleteDriver}:Props)
{
   return(
     <div>
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
                {drivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No drivers found
                  </TableCell>
                </TableRow>
                ):(
                drivers.map(driver => (
                    <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <EllipsisVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => onSelectDriver(driver)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDeleteDriver(driver.id)}>Delete</DropdownMenuItem>
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
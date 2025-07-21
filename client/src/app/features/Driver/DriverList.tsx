import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import type { Driver } from "@/app/models/driver";

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
                            <button onClick={() => onSelectDriver(driver)}>Select</button>
                            <button onClick={() => onDeleteDriver(driver.id)}>Delete</button>
                        </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
        </Table>
    </div>
   )
}
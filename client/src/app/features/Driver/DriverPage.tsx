import agent from "@/app/api/agent";
import UseJobs from "@/app/hooks/UseJobs";
import type { Driver } from "@/app/models/driver";
import { useAppDispatch } from "@/app/Store/configureStore";
import { useState } from "react";
import { removeDriver } from "./DriverSlice";
import DriverList from "./DriverList";
import DriverForm from "./DriverForm";

export default function DriverPage() {
  const { drivers } = UseJobs();
  const dispatch = useAppDispatch();
  const [selectedDriver, setSelectedDriver] = useState<Driver | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [target, setTarget] = useState(0);

  function cancelEdit() {
    if (selectedDriver) setSelectedDriver(undefined);
    setEditMode(false);
  }

  function handleSelectDriver(driver: Driver) {
    setSelectedDriver(driver);
    setEditMode(true);
  }

  function handleDeleteDriver(id: number) {
    setTarget(id);
    agent.Driver.deleteDriver(id)
      .then(() => {
        dispatch(removeDriver(id));
      })
      .catch(error => console.log(error));
  }
   if(editMode)return <DriverForm driver={selectedDriver} cancelEdit={cancelEdit} />
  return (
    
    <div className="container mx-auto p-4">
      <DriverList drivers={drivers} onSelectDriver={handleSelectDriver} onDeleteDriver={handleDeleteDriver}/>
    </div>
  );
}
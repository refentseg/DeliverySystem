import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import JobList from "./JobList";
import { useAppDispatch, useAppSelector } from "@/app/Store/configureStore";
import UseJobs from "@/app/hooks/UseJobs";
import { useState } from "react";
import JobForm from "./JobForm";
import type { Job } from "@/app/models/job";
import { removeJob } from "./JobSlice";
import agent from "@/app/api/agent";

export default function JobPage(){
  // set jobs
  const {jobs} = UseJobs();
  const dispatch = useAppDispatch(); //Future use for pagination maybe??
  const [editMode,setEditMode] = useState(false);
  const [selectedJob,setSelectedJob] = useState<Job | undefined>(undefined);
  const [target,setTarget] = useState(0);

  // Cancels the edit mode and resets the selected job
  function cancelEdit(){
        if(selectedJob) setSelectedJob(undefined);
        setEditMode(false);
  }

  function handleSelectJob(job:Job){
    setSelectedJob(job)
    setEditMode(true);
  }

  function handleDeleteProduct(id:number){
        setTarget(id)
        agent.Job.deleteJob(id)
        .then(()=>dispatch(removeJob(id)))
        .catch(error =>console.log(error))
    }

  // Function to mark a job as delivered
  function handleMarkAsDelivered(id:number){  
    agent.Job.updateStatus(id, "delivered")
      .then(() => {
        console.log(`Job ${id} marked as delivered`);
      })
      .catch(error => console.log(error));
  }
  //Checks if we are in edit mode
  if(editMode)return <JobForm job={selectedJob} cancelEdit={cancelEdit} />
    return(
    <div className="container flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between mb-6">
        <div></div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setEditMode(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>
      <JobList jobs={jobs} 
                onSelectJob={handleSelectJob} 
                onDeleteJob={handleDeleteProduct}
                onMarkAsDelivered={handleMarkAsDelivered}/>
    </div>
    )
}
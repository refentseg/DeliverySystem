import { Button } from "@/app/components/ui/button";
import { Plus } from "lucide-react";
import JobList from "./JobList";
import { use, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/Store/configureStore";
import { fetchJobsAsync, jobSelectors } from "./JobSlice";

export default function JobPage(){
  // set jobs
  const jobs = useAppSelector(jobSelectors.selectAll);
  const { jobsloaded } = useAppSelector((state) => state.jobs);
  const dispatch = useAppDispatch();

  //
  useEffect(() => {
    if (!jobsloaded) dispatch(fetchJobsAsync());
  }, [jobsloaded, dispatch]);
    return(
    <div className="container flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between mb-6">
        <div></div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>
      <JobList jobs={jobs}/>
    </div>
    )
}
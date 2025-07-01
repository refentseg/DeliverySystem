import { useEffect } from "react";
import { fetchJobsAsync, jobSelectors } from "../features/Job/JobSlice";
import { useAppDispatch, useAppSelector } from "../Store/configureStore";
import { customerSelectors, fetchCustomersAsync } from "../features/Customer/CustomerSlice";
import { driverSelectors, fetchDriversAsync } from "../features/Driver/DriverSlice";

export default function UseJobs(){
    const jobs = useAppSelector(jobSelectors.selectAll);
    const customers = useAppSelector(customerSelectors.selectAll);
    const drivers = useAppSelector(driverSelectors.selectAll);
    const {driversLoaded} = useAppSelector((state) => state.drivers);
    const {customersLoaded} = useAppSelector((state) => state.customers);
    const {jobsLoaded} = useAppSelector((state) => state.jobs);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!jobsLoaded) {
            dispatch(fetchJobsAsync());
        }
    }, [jobsLoaded, dispatch]);

    useEffect(() => {
            if (!customersLoaded) {
                dispatch(fetchCustomersAsync());
            }
        }, [customersLoaded, dispatch]);
    useEffect(() => {
        if (!driversLoaded) {
            dispatch(fetchDriversAsync());
        }
    }
    , [driversLoaded, dispatch]);
    return {
        jobs,
        jobsLoaded,
        customers,
        customersLoaded,
        drivers,
        driversLoaded,
    };
}
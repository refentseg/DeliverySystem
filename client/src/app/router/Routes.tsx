import {  createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import DriverPage from "../features/Driver/DriverPage";
import CustomerPage from "../features/Customer/CustomerPage";
import JobPage from "../features/Job/JobPage";

export const router = createBrowserRouter([
    {path: '/',
        element: <App />,
        children:[
            {path: 'deliveries', element: < JobPage/>},
            {path: 'drivers', element: <DriverPage />},
            {path: 'customers', element: <CustomerPage />}
        ]
    }
])
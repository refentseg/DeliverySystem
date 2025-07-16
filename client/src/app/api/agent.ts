import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    return response;
},
    (error:AxiosError)=>{
    const {data,status} = error?.response as AxiosResponse;
    switch (status) {
        case 400:
            if(data.errors){
                const modelStateErrors: string[] = [];
                for (const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }

                }
                throw modelStateErrors.flat()
            }
            toast.error(data.title)
            break;
        case 401:
            toast.error(data.title)
            break;
        case 403:
            toast.error("You are not allowed to do that")
            break;
        case 500:
            toast.error(data.title || "Server error - see console for more details");
            break;
        default:
            break;
    }
    return Promise.reject(error.response)
    }
)

const request = {
    get:(url:string, params?: any) => axios.get(url, { params }).then(responseBody),
    post:(url:string,body:object)=>axios.post(url,body).then(responseBody),
    put:(url:string,body:object)=>axios.put(url,body).then(responseBody),
    patch:(url:string,body:object)=>axios.patch(url,body).then(responseBody),
    delete:(url:string)=>axios.delete(url).then(responseBody),
    postForm:(url:string,data:FormData) => axios.post(url,data,{
        headers:{'Content-type':'multipart/form-data'}
    }).then(responseBody),
    putForm:(url:string,data:FormData) => axios.put(url,data,{
        headers:{'Content-type':'multipart/form-data'}
    }).then(responseBody)
}

function createFormData(item:any) {
    const formData = new FormData();
    for (const key in item){
        formData.append(key,item[key])
    }
    return formData;
}

const Dashboard = {
    getMetrics: () => request.get('/dashboard/metrics'),
    
    getDailyDeliveries: () => request.get('/dashboard/daily-deliveries'),
    
    getWeeklyTrend: () => request.get('/dashboard/weekly-trend'),
    
    getRecentActivity: () => request.get('/dashboard/recent-activity'),
    
    getStats: () => request.get('/dashboard/stats'),
    
}


const Job = {
    list: (params?: any) => request.get('/job', params),
    details: (id: number) => request.get(`/job/${id}`),
    createJob: (job: any) => request.postForm('/job/', createFormData(job)),
    updateJob: (job: any) => request.putForm(`/job/${job.id}/`, createFormData(job)),
    updateStatus: (id: number, status: string) => request.patch(`/job/${id}/`, { status }),
    deleteJob: (id: number) => request.delete(`/job/${id}/`),    
}


const Customer ={
    list: (params?: any) => request.get('/customer', params),
    details: (id: number) => request.get(`/customer/${id}`),
    createCustomer: (customer: any) => request.postForm('/customer/', createFormData(customer)),
    updateCustomer: (customer: any) => request.putForm(`/customer/${customer.id}/`, createFormData(customer)),
    deleteCustomer: (id: number) => request.delete(`/customer/${id}/`),
}


const Driver = {
    list: (params?: any) => request.get('/driver', params),
    details: (id: number) => request.get(`/driver/${id}`),
}


const agent = {
    Dashboard,
    Job,
    Driver,
    Customer
}

export default agent;
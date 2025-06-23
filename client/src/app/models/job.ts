// models/Job.ts

import type { Customer } from "./customer";
import type { Driver } from "./driver";

export interface Job {
  id: number;
  created_at: string;
  customer: Customer;
  driver: Driver ;
  delivery_from: string;
  destination: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  image: string ;
  scheduled_time: string;
  delivery_time: string ;
}
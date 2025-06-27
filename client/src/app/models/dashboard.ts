export interface DashboardMetrics {
    total_deliveries: number;
    completed: number;
    pending: number;
    success_rate: number;
    daily_average: number;
}

export interface DailyDelivery {
    day: string;
    deliveries: number;
    completed: number;
    pending: number;
}

export interface WeeklyTrend {
    week: string;
    deliveries: number;
    avgPerDay: number;
}

export interface RecentActivity {
    id: string;
    status: 'pending' | 'assigned' | 'loading_cargo' | 'in_progress' | 'delivered' | 'cancelled';
    status_code: string;
    message: string;
    customer: string;
    driver: string | null;
    activity_time: string;
    destination: string;
    priority: string;
    priority_code: string;
}

export interface DeliveryStats {
    today: {
        total: number;
        completed: number;
        pending: number;
        in_progress: number;
    };
    this_week: {
        total: number;
        completed: number;
        pending: number;
        avg_per_day: number;
    };
    this_month: {
        total: number;
        completed: number;
        pending: number;
        success_rate: number;
    };
}
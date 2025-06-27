import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart";
import { useAppDispatch, useAppSelector } from "@/app/Store/configureStore";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Icon, Package, Truck, UserCheck, XCircle } from "lucide-react";
import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { clearDashboardError, fetchAllDashboardData, fetchDashboardMetrics } from "./DashboardSlice";
import RecentActivity from "./Components/RecentActivity";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const {
        metrics,
        dailyDeliveries,
        weeklyTrend,
        recentActivity,
        stats,
        loading,
        error,
        lastUpdated
    } = useAppSelector((state) => state.dashboard);
  
    useEffect(() => {
        dispatch(fetchAllDashboardData());
    }, [dispatch]);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(fetchDashboardMetrics());
        }, 10 * 60 * 1000);

         return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(fetchDashboardMetrics());
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [dispatch])

    const handleClearError = (errorType: keyof typeof error) => {
        dispatch(clearDashboardError(errorType));
    };
  

    if (loading.metrics) {
          return <div>Loading dashboard...</div>;
    }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {error.metrics && (
                <div className="error-banner">
                    <span>Error loading metrics: {error.metrics}</span>
                    <button onClick={() => handleClearError('metrics')}>×</button>
                </div>
            )}
        {/* Stats Overview */}
        {metrics && (
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metrics.total_deliveries}</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.completed}</div>
              <p className="text-xs text-gray-500 mt-1">
                {metrics.success_rate}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.pending}</div>
              <p className="text-xs text-gray-500 mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Daily Average</CardTitle>
              <AlertCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.daily_average}</div>
              <p className="text-xs text-gray-500 mt-1">Per day</p>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Deliveries Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Daily Deliveries</CardTitle>
              <CardDescription>Delivery volume for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  deliveries: {
                    label: "Total Deliveries",
                    color: "orange",
                  },
                  completed: {
                    label: "Completed",
                    color: "green",
                  },
                }}
                className="h-[250px] w-full"
              >
                <BarChart data={dailyDeliveries} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} interval={0} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
                  <Bar dataKey="deliveries" fill="var(--color-deliveries)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Weekly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Weekly Trends</CardTitle>
              <CardDescription>Delivery trends over the past weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  deliveries: {
                    label: "Weekly Deliveries",
                    color: "",
                  },
                  avgPerDay: {
                    label: "Daily Average",
                    color:"",
                  },
                }}
                className="h-[250px] w-full"
              >
                <LineChart data={weeklyTrend} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="deliveries"
                    stroke="black"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-deliveries)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgPerDay"
                    stroke="blue"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "var(--color-avgPerDay)", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}     
        <RecentActivity recentActivity={recentActivity}/>
      </main>
    </div>
  );
}
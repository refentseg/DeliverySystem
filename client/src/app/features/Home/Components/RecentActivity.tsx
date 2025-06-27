import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import type {RecentActivity} from '@/app/models/dashboard';
import {AlertTriangle, CheckCircle, Clock, Package, Truck, UserCheck, XCircle} from 'lucide-react';
type DeliveryStatus = 'pending' | 'assigned' | 'loading_cargo' | 'in_progress' | 'delivered' | 'cancelled';

interface Props{
    recentActivity:RecentActivity[];
}
export default function RecentActivity({ recentActivity }:Props) {
    const getStatusClasses = (status:DeliveryStatus) => {
        const classMap = {
            pending: {
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            badge: 'bg-gray-100 text-gray-800',
            icon: Clock
            },
            assigned: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            badge: 'bg-blue-100 text-blue-800',
            icon: UserCheck
            },
            loading_cargo: {
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            badge: 'bg-orange-100 text-orange-800',
            icon: Package
            },
            in_progress: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
            badge: 'bg-indigo-100 text-indigo-800',
            icon: Truck
            },
            delivered: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            badge: 'bg-green-100 text-green-800',
            icon: CheckCircle
            },
            cancelled: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            badge: 'bg-red-100 text-red-800',
            icon: XCircle
            }
        };
        
        return classMap[status] || {
            bg: 'bg-gray-50',
            text: 'text-gray-600',
            badge: 'bg-gray-100 text-gray-800',
            icon: AlertTriangle
        };
    };

    return(
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest delivery updates</CardDescription>
          </CardHeader>
          <CardContent>
                <div className="space-y-4">
                    {recentActivity.map((activity) => {
                        const classes = getStatusClasses(activity.status.toLowerCase() as DeliveryStatus);
                        const IconComponent = classes.icon;
                        return (
                        <div key={activity.id} className={`flex items-center justify-between p-3 ${classes.bg} rounded-lg`}>
                            <div className="flex items-center space-x-3">
                            <IconComponent className={`w-5 h-5 ${classes.text}`} />
                            <div>
                                <p className="font-medium text-gray-900">Delivery {activity.id}</p>
                                <p className="text-sm text-gray-500">{activity.message}</p>
                            </div>
                            </div>
                            <Badge variant="secondary" className={classes.badge}>
                            {activity.status}
                            </Badge>
                        </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
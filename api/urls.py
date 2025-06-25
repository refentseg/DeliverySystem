
from django.urls import path

from .views import (
    CumstomerDetailView, CustomersView, DailyDeliveriesView,
    DashboardMetricsView, DeliveryStatsView,
    DriverDetailView, DriversView, JobDetailView, JobsView, RecentActivityView,
    WeeklyTrendView
)

app_name = 'webapp'
urlpatterns = [
    path('job/', JobsView.as_view(), name='jobs'),
    path('job/<int:pk>/', JobDetailView.as_view(), name='job_detail'),

    path('customer/', CustomersView.as_view(), name='customers'),
    path('customer/<int:pk>/', CumstomerDetailView.as_view(),
         name='customer_detail'),

    path('driver/', DriversView.as_view(), name='drivers'),
    path('driver/<int:pk>/', DriverDetailView.as_view(), name='driver_detail'),

    # Main dashboard metrics (Total, Completed, Pending, Daily Average)
    path('dashboard/metrics/', DashboardMetricsView.as_view(),
         name='dashboard-metrics'),

    # Daily deliveries chart data
    path('dashboard/daily-deliveries/', DailyDeliveriesView.as_view(),
         name='daily-deliveries'),

    # Weekly trend chart data
    path('dashboard/weekly-trend/', WeeklyTrendView.as_view(),
         name='weekly-trend'),

    # Recent activity feed
    path('dashboard/recent-activity/', RecentActivityView.as_view(),
         name='recent-activity'),

    # Comprehensive stats
    path('dashboard/stats/', DeliveryStatsView.as_view(),
         name='delivery-stats'),

]

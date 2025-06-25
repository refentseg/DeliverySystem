from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import (
    CustomerSerializer, DriverSerializer, JobSerializer)
from api.models import Customer, Driver, Job
from rest_framework import status
from django.shortcuts import get_object_or_404

from django.utils import timezone
from calendar import monthrange
from datetime import timedelta
# Create your views here.


class CustomersView(APIView):
    # Gets all Customers
    def get(self, request):
        """Retrieve all customers"""
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new customer"""
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CumstomerDetailView(APIView):
    """Retrieve, update or delete a customer by ID"""
    def get(self, request, pk):
        """Get a single customer"""
        customer = get_object_or_404(Customer, pk=pk)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def put(self, request, pk):
        """Update a customer (full update)"""
        customer = get_object_or_404(Customer, pk=pk)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Partially update a customer"""
        customer = get_object_or_404(Customer, pk=pk)
        serializer = CustomerSerializer(customer, data=request.data,
                                        partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a customer"""
        customer = get_object_or_404(Customer, pk=pk)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DriversView(APIView):
    # Gets all Drivers
    def get(self, request):
        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new driver"""
        serializer = DriverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DriverDetailView(APIView):
    """Retrieve, update or delete a driver by ID"""
    def get(self, request, pk):
        """Get a single driver"""
        driver = get_object_or_404(Driver, pk=pk)
        serializer = DriverSerializer(driver)
        return Response(serializer.data)

    def put(self, request, pk):
        """Update a driver (full update)"""
        driver = get_object_or_404(Driver, pk=pk)
        serializer = DriverSerializer(driver, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Partially update a driver"""
        driver = get_object_or_404(Driver, pk=pk)
        serializer = DriverSerializer(driver, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a driver"""
        driver = get_object_or_404(Driver, pk=pk)
        driver.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class JobsView(APIView):
    # Gets all Jobs
    def get(self, request):
        jobs = Job.objects.all().select_related('customer', 'driver')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new job"""
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetailView(APIView):
    """Retrieve, update or delete a job by ID"""
    def get(self, request, pk):
        """Get a single job"""
        job = get_object_or_404(Job, pk=pk)
        serializer = JobSerializer(job)
        return Response(serializer.data)

    def put(self, request, pk):
        """Update a job (full update)"""
        job = get_object_or_404(Job, pk=pk)
        serializer = JobSerializer(job, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """Partially update a job"""
        job = get_object_or_404(Job, pk=pk)
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a job"""
        job = get_object_or_404(Job, pk=pk)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DashboardMetricsView(APIView):
    """
    Get overall dashboard metrics (Total Deliveries,
    Completed, Pending, Daily Average)
    """
    def get(self, request):
        now = timezone.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0,
                                          microsecond=0)

        # Get current month jobs
        month_jobs = Job.objects.filter(created_at__gte=current_month_start)

        # Total deliveries this month
        total_deliveries = month_jobs.count()

        # Completed deliveries (delivered status)
        completed = month_jobs.filter(status='delivered').count()

        # Pending deliveries (all statuses except delivered and cancelled)
        pending = month_jobs.exclude(
            status__in=['delivered', 'cancelled']).count()

        # Success rate
        success_rate = round(
            (completed / total_deliveries * 100)
            if total_deliveries > 0 else 0)

        # Daily average (total deliveries / days in month so far)
        days_in_month = now.day
        daily_average = round(
            total_deliveries / days_in_month) if days_in_month > 0 else 0

        return Response({
            'total_deliveries': total_deliveries,
            'completed': completed,
            'pending': pending,
            'success_rate': success_rate,
            'daily_average': daily_average
        })


class DailyDeliveriesView(APIView):
    """
    Get daily deliveries for the current month
    """
    def get(self, request):
        now = timezone.now()
        current_month_start = now.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0)
        days_in_month = monthrange(now.year, now.month)[1]

        daily_data = []

        for day in range(1, days_in_month + 1):
            day_start = current_month_start.replace(day=day)
            day_end = day_start + timedelta(days=1)

            # Get jobs created on this day
            day_jobs = Job.objects.filter(
                created_at__gte=day_start,
                created_at__lt=day_end
            )

            total_deliveries = day_jobs.count()
            completed = day_jobs.filter(status='delivered').count()
            pending = day_jobs.exclude(
                status__in=['delivered', 'cancelled']).count()

            daily_data.append({
                'day': str(day),
                'deliveries': total_deliveries,
                'completed': completed,
                'pending': pending
            })

        return Response(daily_data)


class WeeklyTrendView(APIView):
    """
    Get weekly delivery trends for the past 4 weeks
    """
    def get(self, request):
        now = timezone.now()
        # Start from beginning of current week (Monday)
        current_week_start = now - timedelta(days=now.weekday())
        current_week_start = current_week_start.replace(
            hour=0, minute=0, second=0, microsecond=0)

        weekly_data = []

        # Get data for 4 weeks (3 complete weeks + current week)
        for week_offset in range(3, -1, -1):
            week_start = current_week_start - timedelta(weeks=week_offset)
            week_end = week_start + timedelta(days=7)

            # For current week, only count up to today
            if week_offset == 0:
                week_end = min(week_end, now + timedelta(days=1))
                week_label = "Current"
                days_in_week = (now - week_start).days + 1
            else:
                week_label = f"Week {4 - week_offset}"
                days_in_week = 7

            # Get jobs for this week
            week_jobs = Job.objects.filter(
                created_at__gte=week_start,
                created_at__lt=week_end
            )

            total_deliveries = week_jobs.count()
            avg_per_day = round(
                total_deliveries / days_in_week, 1) if days_in_week > 0 else 0

            weekly_data.append({
                'week': week_label,
                'deliveries': total_deliveries,
                'avgPerDay': avg_per_day
            })

        return Response(weekly_data)


class RecentActivityView(APIView):
    """
    Get recent delivery activities (latest completed deliveries)
    """
    def get(self, request):
        # Get last 10 completed deliveries
        recent_jobs = Job.objects.filter(
            status='delivered'
        ).order_by('-delivery_time')[:10]

        activities = []
        for job in recent_jobs:
            activities.append({
                'id': f"D{job.created_at.strftime('%Y')}-{job.id:04d}",
                'status': 'Completed',
                'message': 'Completed successfully',
                'customer': job.customer.name if hasattr(
                    job.customer, 'name') else f"Customer {job.customer.id}",
                'delivery_time': job.delivery_time.isoformat()
                if job.delivery_time else None,
                'destination': job.destination
            })

        return Response(activities)


class DeliveryStatsView(APIView):
    """
    Get comprehensive delivery statistics
    """
    def get(self, request):
        now = timezone.now()

        # Today's stats
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_jobs = Job.objects.filter(created_at__gte=today_start)

        # This week's stats
        week_start = now - timedelta(days=now.weekday())
        week_start = week_start.replace(
            hour=0, minute=0, second=0, microsecond=0)
        week_jobs = Job.objects.filter(created_at__gte=week_start)

        # This month's stats
        month_start = now.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0)
        month_jobs = Job.objects.filter(created_at__gte=month_start)

        return Response({
            'today': {
                'total': today_jobs.count(),
                'completed': today_jobs.filter(status='delivered').count(),
                'pending': today_jobs.exclude(
                    status__in=['delivered', 'cancelled']).count(),
                'in_progress': today_jobs.filter(status='in_progress').count()
            },
            'this_week': {
                'total': week_jobs.count(),
                'completed': week_jobs.filter(status='delivered').count(),
                'pending': week_jobs.exclude(
                    status__in=['delivered', 'cancelled']).count(),
                'avg_per_day': round(
                    week_jobs.count() / (now.weekday() + 1), 1)
            },
            'this_month': {
                'total': month_jobs.count(),
                'completed': month_jobs.filter(status='delivered').count(),
                'pending': month_jobs.exclude(
                    status__in=['delivered', 'cancelled']).count(),
                'success_rate': round(
                    (month_jobs.filter(
                        status='delivered').count() / month_jobs.count() * 100)
                    if month_jobs.count() > 0 else 0
                )
            }
        })

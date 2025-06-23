from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import (
    CustomerSerializer, DriverSerializer, JobSerializer)
from api.models import Customer, Driver, Job
from rest_framework import status
from django.shortcuts import get_object_or_404

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

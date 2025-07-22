from rest_framework import serializers
from .models import Customer, Driver, Job


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone']


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'name', 'email', 'phone', 'license_number']


class JobSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    driver = DriverSerializer(read_only=True)

    # For write operations
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        source='customer',
        write_only=True
    )
    driver_id = serializers.PrimaryKeyRelatedField(
        queryset=Driver.objects.all(),
        source='driver',
        write_only=True
    )

    class Meta:
        model = Job
        fields = [
            'id', 'created_at', 'delivery_from', 'destination',
            'status', 'priority', 'image', 'scheduled_time',
            'delivery_time', 'customer', 'driver', 'customer_id', 'driver_id'
        ]

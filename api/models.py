from django.db import models

# Create your models here.


class Job(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('loading_cargo', 'Loading Cargo'),
        ('in_progress', 'In Progress'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    # Created
    created_at = models.DateTimeField(auto_now_add=True)

    # Relationships
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE,
                                 related_name='jobs')
    driver = models.ForeignKey('Driver', on_delete=models.SET_NULL, null=True,
                               blank=True, related_name='jobs')

    # Delivery Details
    delivery_from = models.CharField(max_length=255,
                                     help_text="Origin address")
    destination = models.CharField(max_length=255,
                                   help_text="Destination address")

    # Status and priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,
                              default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES,
                                default='medium')

    # Image
    image = models.ImageField(upload_to='job_images/', null=True, blank=True,
                              help_text="Image of the package")

    # Delivery time
    scheduled_time = models.DateTimeField(
        help_text="Scheduled delivery time")
    delivery_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Job {self.id} - {self.status} - {self.customer.name}"


class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.name


class Driver(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    license_number = models.CharField(max_length=50, unique=True)
    code = models.CharField(max_length=2, unique=True)

    def __str__(self):
        return self.name

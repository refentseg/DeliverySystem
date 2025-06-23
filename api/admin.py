from django.contrib import admin

from api.models import Customer, Driver, Job

# Register your models here.
admin.site.register(Job)
admin.site.register(Customer)
admin.site.register(Driver)

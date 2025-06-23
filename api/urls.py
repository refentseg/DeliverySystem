
from django.urls import path

from .views import (
    CumstomerDetailView, CustomersView,
    DriverDetailView, DriversView, JobDetailView, JobsView
)

app_name = 'webapp'
urlpatterns = [
    path('job/', JobsView.as_view(), name='jobs'),
    path('job/<int:pk>/', JobDetailView.as_view(), name='job_detail'),

    path('customer/', CustomersView.as_view(), name='customers'),
    path('customer/<int:pk>/', CumstomerDetailView.as_view(),
         name='customer_detail'),

    path('driver/', DriversView.as_view(), name='drivers'),
    path('driver/<int:pk>/', DriverDetailView.as_view(), name='driver_detail')
]

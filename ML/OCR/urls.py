from django.urls import path
from . import views

urlpatterns = [
    path('carbon-footprintimage/', views.CarbonFootprintViews.as_view(), name='carbon-footprintimage'),
]
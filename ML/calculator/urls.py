from django.urls import path
from . import views

urlpatterns = [
    path('analyze-carbon-footprint/', views.analyze_carbon_footprint, name='analyze_carbon_footprint'),
]
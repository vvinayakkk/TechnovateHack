from django.urls import path
from . import views

urlpatterns = [
    path('api/top-products/', views.get_top_products, name='top-products'),
]
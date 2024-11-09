from django.urls import path
from . import views

urlpatterns = [
    path('top-products/', views.get_top_products, name='top-products'),
    path('top-productsone/', views.get_first_product, name='top-productsone'),
]
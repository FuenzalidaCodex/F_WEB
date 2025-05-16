from django.urls import path
from .views import mostrar_productos

urlpatterns = [
    path('', mostrar_productos),
]
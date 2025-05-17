from django.urls import path
from .views import productos
from . import views

urlpatterns = [
    path('', productos),
    path('contacto/', views.contacto, name='contacto'),
    path('productos/', views.productos, name='productos'),
    path('usuario/inicio_sesion/', views.inicio_sesion, name='usuario/inicio_sesion'),
    path('usuario/registrarse/', views.registrarse, name='usuario/registrarse'),
    
]
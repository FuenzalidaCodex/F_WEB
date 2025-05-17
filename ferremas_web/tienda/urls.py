from django.urls import path
from .views import productos
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('', productos),
    path('contacto/', views.contacto, name='contacto'),
    path('productos/', views.productos, name='productos'),
    path('usuario/inicio_sesion/', views.inicio_sesion, name='usuario/inicio_sesion'),
    path('usuario/registrarse/', views.registrarse, name='usuario/registrarse'),
    path('detalle/', TemplateView.as_view(template_name='detalle.html'), name='detalle_producto'),
    path('carrito/', views.carrito, name='carrito'),
    
]
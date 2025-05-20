from django.urls import path
from .views import productos, pago_exitoso, pago_cancelado
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
    path('empleados/bodeguero/', views.bodeguero_view, name='bodeguero'),
    path('empleados/vendedor/', views.vendedor_view, name='vendedor'),
    path('empleados/contador/', views.contador_view, name='contador'),
    path('empleados/admin/', views.admin_view, name='admin'),
    path('compras/', views.compras, name='compras'),
    path('exito/', pago_exitoso, name='pago_exito'),
    path('cancelado/', pago_cancelado, name='pago_cancelado'),

    
]
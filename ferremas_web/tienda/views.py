import requests
from django.shortcuts import render

def productos(request):
    return render(request, 'productos.html')

def contacto(request):
    return render(request, 'contacto.html')

def inicio_sesion(request):
    return render(request, 'usuario/inicio_sesion.html')

def registrarse(request):
    return render(request, 'usuario/registrarse.html')

def carrito(request):
    return render(request, 'carrito.html')


def bodeguero_view(request):
    return render(request, 'empleados/bodeguero.html')


def vendedor_view(request):
    return render(request, 'empleados/vendedor.html')

def contador_view(request):
    return render(request, 'empleados/contador.html')

def admin_view(request):
    return render(request, 'empleados/admin.html')

def compras(request):
    return render(request, 'compras.html')



def pago_exitoso(request):
    return render(request, 'pago/exito.html')

def pago_cancelado(request):
    return render(request, 'pago/cancelado.html')

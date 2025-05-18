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



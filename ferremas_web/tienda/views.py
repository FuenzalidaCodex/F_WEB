import requests
from django.shortcuts import render

def mostrar_productos(request):
    return render(request, 'productos.html')

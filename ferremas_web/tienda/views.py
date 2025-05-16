import requests
from django.shortcuts import render

def lista_productos(request):
    response = requests.get("http://localhost:8000/api/productos/")
    productos = response.json() if response.status_code == 200 else []
    return render(request, 'pages/productos.html', {'productos': productos})

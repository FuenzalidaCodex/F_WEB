# F_WEB

para usar la web primero carga la F_API:

inicias con:

cd ferremas_web

y luego con:

pip install -r requirements.txt

puedes cargar migraciones por si acaso:

python manage.py makemigrations
python manage.py migrate


con el siguiente comando inicias el server:

python manage.py runserver 8001
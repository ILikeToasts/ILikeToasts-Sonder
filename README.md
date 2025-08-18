# MR

## Installation

1. Clone repo `git clone https://github.com/ILikeToasts/ILikeToasts-MR.git`
2. Make sure Python >=3.12 is installed on your PC. Create a Python environnement CTRL + SHIFT + P -> Venv -> your python version

### Backend

3. Open a terminal and run `cd backend` then `poetry install`
4. Download DockerDesktop : https://www.docker.com/products/docker-desktop/ and launch the app
5. Run `docker-compose build --no-cache` then `docker-compose up` you should see all your containers up and running
6. You should be able to access these links : http://localhost:8000/swagger/ and http://localhost:8000/admin/

### Frontend

6. Open a new terminal and run `cd mr-frontend` then `npm install` then `npm run dev`
7. You should be able to access the site : http://localhost:5173/

### Useful dev commands :

docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

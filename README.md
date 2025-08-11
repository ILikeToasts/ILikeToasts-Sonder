# MR

### Docker commands

#### Rebuild everything

`docker-compose build --no-cache`

### Frontend

npm run start

### Backend

#### To run backend

`docker-compose up backend`

#### To run database

`docker-compose up db`

### Useful dev commands

docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

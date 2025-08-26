---
layout: default
title: Home
---

## What is this projet?

This is a personnal project I developped during the Summer 2025 to test my web application developpement skills.
It's a web application to store my favorite artists, albums, tracks/singles and will eventually contain stuff like, trips, games etc.
For now, everything is hosted locally.

## Want to see what it looks like ?

[Small demo video](https://youtu.be/SeaWwgdMCVc)

## Features :

- [Albums (Done)](albums/albums.md)
- [Artists (Done)](artists/artists.md)
- [Tracks/Singles (Done)](tracks/tracks.md)
- [Pictures (Done)](pictures/pictures.md)
- [Movies & TVShows](media/media.md)
- Games (TODO)
- Trips (50% done)

## Technologies used :

### Frontend

My frontend is in React(TypeScript) and I used Vite to setup my frontend.

I used some components from [ReactBits](https://github.com/DavidHDev/react-bits) and [shadcn](https://github.com/shadcn-ui/ui) to make the app prettier. Both of those libraries are under the MIT License.

### Backend

My backend was developped with Python(Django). I use models, serializers, views and urls to handle data.
I also have some automated tasks using a combination of Celery and Redis.

#### APIs

I used SpotifyWebAPI, LastFM API and YTMusicAPI to fetch the appropriate data.
All the secrets are stored in a `.env` file.

##### Website API (Swagger)

To test my multiple endpoints I use Swagger. Thats also what I use to add data to my app for now.

##### Current endpoints :

![alt text](endpoints.png)

#### Automated task

I use celery to handle the task which includes a worker and a beat and also a message broker (redis).
I also configured flower to monitor the queue, task progress and potential errors.

The tasks are also registered and can be seen in Django Admin :
![alt text](autoTasks.png)

![alt text](cron.png)

### Database

I use a simple MySQL Database!

### Tests

I used pytest to develop a test suite. I simply created to markers `unit`and `integration` to specify the test types.

#### Test coverage as of 8/18/2025

![alt text](test_coverage.png)

#### Here is an example of an integration test for a view :

![alt text](integration_test_example.png)

### DevOps

I simply used Github Actions.

#### CI

- When there's a new push : .pre-commit.yaml launches, which runs linters (black, flake8, isort and prettier) and integration tests
- If the target branch is `main` it will then create a new image of the app and push it to DockerHub

#### CD

The CD pipeline might eventually get developped once I decided to host the web app.

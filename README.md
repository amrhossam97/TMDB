# 🎬 TMDB Movies API (NestJS Backend Challenge)

A full-featured backend REST API that syncs with [TMDB](https://www.themoviedb.org/) to manage movies, genres, user ratings, and watchlists.

---

## 🚀 Features

- ✅ Sync movies and genres from TMDB API
- ✅ Store movies in PostgreSQL
- ✅ Filter by genre, release date, and search by title
- ✅ Add user ratings (with average shown)
- ✅ Add to watchlist / mark as favorite
- ✅ Caching with Redis
- ✅ Cron jobs for periodic sync
- ✅ Pagination support
- ✅ Fully dockerized setup
- ✅ Clean modular structure using NestJS
- ✅ Unit tests 

---

## 🗂️ Project Structure

The project follows a modular structure using NestJS.  
Each domain (auth, movies, genres, rating, TMDB) has its own folder under `src/domains/`.  
Common utilities, DTOs, decorators, and helpers are under `src/common/`.  
Database entities and migrations are under `src/database/`.

```
src/
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts
  common/
    Dto/
    decorators/
    cronJob/
    redis/
    ...
  config/
  database/
    entity/
    migration/
  domains/
    auth/
    genres/
    movies/
    rating/
    TMDB/
```

---

## 🛠️ Technologies

- NestJS (TypeScript)
- PostgreSQL
- Redis
- TypeORM
- Docker / Docker Compose
- TMDB API
- ioredis

---

## ⚙️ Setup Instructions

### 📦 Prerequisites

- Node.js `>= 18`
- Docker + Docker Compose

---

### 🚀 Run the project

```bash
git clone 'https://github.com/amrhossam97/TMDB.git'
cd TMDB

# Build and run using Docker
docker-compose up
```

---

## 📄 Documentation

- All modules, services, and APIs are documented using markdown files.
- For details about each module, see the markdown files inside each domain or common folder.
- The project structure, setup process, and prerequisites are explained here and in related markdown files.

---

## 🧪 Testing

- Unit tests are written using Jest.
- To run tests:
  ```bash
  npm run test
  ```
- Test files are located next to their related modules and services, named as `*.spec.ts`.

---

## 📝 Contributing

- Please read the markdown documentation before contributing.
- Follow the modular structure and keep documentation up to date.
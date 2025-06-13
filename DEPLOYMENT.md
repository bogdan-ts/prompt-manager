# Deployment Guide

## 🐳 Docker Deployment

### Local Development with Docker

1. **Build and run with Docker Compose:**

```bash
docker-compose up --build
```

2. **Access the application:**

- App: http://localhost:3000
- PostgreSQL: localhost:5432

### Manual Docker Build

1. **Build the image:**

```bash
docker build -t prompt-manager .
```

2. **Run with external PostgreSQL:**

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/prompt_manager" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  prompt-manager
```

## 🚀 Dokploy Deployment

### Using Template

1. **Import template in Dokploy:**
   - Upload the `template.yml` file
   - Configure environment variables
   - Deploy

### Manual Setup

1. **Create new application in Dokploy**
2. **Configure services:**

   - **PostgreSQL Database:**

     - Image: `postgres:15-alpine`
     - Environment variables:
       - `POSTGRES_DB=prompt_manager`
       - `POSTGRES_USER=postgres`
       - `POSTGRES_PASSWORD=password`

   - **Next.js Application:**
     - Build from repository
     - Dockerfile: `./Dockerfile`
     - Environment variables:
       - `DATABASE_URL=postgresql://postgres:password@postgres:5432/prompt_manager`
       - `NEXTAUTH_URL=https://your-domain.com`
       - `NEXTAUTH_SECRET=your-random-secret`

3. **Deploy and access**

## 🔧 Environment Variables

### Required Variables

| Variable          | Description                  | Example                               |
| ----------------- | ---------------------------- | ------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL`    | Base URL for authentication  | `https://your-domain.com`             |
| `NEXTAUTH_SECRET` | Secret for JWT signing       | `random-secret-string`                |

### Optional Variables

| Variable   | Description      | Default      |
| ---------- | ---------------- | ------------ |
| `NODE_ENV` | Environment mode | `production` |
| `PORT`     | Application port | `3000`       |

## 📝 Notes

- The application automatically runs Prisma migrations on startup
- PostgreSQL data is persisted in Docker volumes
- The app uses standalone Next.js output for optimal Docker performance
- Health checks ensure PostgreSQL is ready before starting the app

## 🔍 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose logs postgres

# Verify database connection
docker-compose exec postgres psql -U postgres -d prompt_manager
```

### Application Issues

```bash
# Check application logs
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache app
```

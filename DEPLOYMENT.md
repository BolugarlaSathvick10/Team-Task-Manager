# TeamFlow - Deployment Guide

This guide covers deployment of TeamFlow to various platforms.

## Prerequisites

- Project built with `npm run build`
- Environment variables configured in target platform
- PostgreSQL database provisioned

## Environment Variables Required

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

## Deployment Platforms

### 1. Vercel (Recommended)

**Best for**: Simple, fast deployment with Next.js

#### Steps:

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_API_URL`
6. Click "Deploy"

#### Database Setup:

```bash
# After deployment, run migrations via Vercel CLI or SSH
vercel env pull
npm run prisma:migrate
npm run prisma:seed
```

### 2. Railway

**Best for**: Quick setup with built-in database options

#### Steps:

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Add GitHub repository
5. Configure environment variables
6. Deploy

#### Database Setup:

```bash
# After deployment
npm run prisma:migrate
npm run prisma:seed
```

### 3. Render

**Best for**: Free tier with good performance

#### Steps:

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
5. Add environment variables
6. Add PostgreSQL database
7. Deploy

### 4. AWS (EC2)

**Best for**: Full control and scalability

#### Steps:

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone repository:
   ```bash
   git clone https://github.com/yourusername/teamflow.git
   cd teamflow
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Create `.env.local`:
   ```bash
   nano .env.local
   # Add your environment variables
   ```
7. Build application:
   ```bash
   npm run build
   ```
8. Setup database:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
9. Start application:
   ```bash
   npm start
   ```
10. Setup PM2 for auto-restart:
    ```bash
    npm install -g pm2
    pm2 start npm --name "teamflow" -- start
    pm2 startup
    pm2 save
    ```

### 5. Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: teamflow
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: teamflow
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

### 6. Heroku

**Steps:**

1. Create Heroku account and install CLI
2. Login:
   ```bash
   heroku login
   ```
3. Create app:
   ```bash
   heroku create your-app-name
   ```
4. Add PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```
5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NEXT_PUBLIC_API_URL=https://your-app-name.herokuapp.com
   ```
6. Deploy:
   ```bash
   git push heroku main
   ```
7. Run migrations:
   ```bash
   heroku run npm run prisma:migrate
   heroku run npm run prisma:seed
   ```

## Database Setup

### Using Neon (Recommended)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create new project
3. Get connection string
4. Add to `DATABASE_URL` in your platform

### Using AWS RDS

1. Create RDS PostgreSQL instance
2. Configure security groups to allow access
3. Get connection string
4. Add to `DATABASE_URL`

### Using DigitalOcean

1. Create managed PostgreSQL database
2. Get connection string
3. Add to `DATABASE_URL`

## Production Best Practices

### Security

```bash
# Generate strong JWT secret
openssl rand -hex 32
```

### Performance

1. Enable Prisma query optimization
2. Add caching headers in Next.js
3. Use CDN for static assets
4. Enable database connection pooling (PgBouncer)

### Monitoring

- Setup error tracking (Sentry)
- Monitor performance (New Relic, DataDog)
- Setup uptime monitoring (UptimeRobot)

### Backup Strategy

```bash
# Regular PostgreSQL backups
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check Prisma configuration
npx prisma validate
```

### Build Failures

```bash
# Clear build cache
rm -rf .next
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Runtime Errors

```bash
# Check logs
npm run dev -- --debug

# Validate schema
npx prisma db validate
```

## Scaling Considerations

1. Use read replicas for database
2. Implement caching (Redis)
3. Use queue system (Bull, RabbitMQ)
4. Setup load balancing
5. Monitor and optimize queries

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npx prisma migrate deploy
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Post-Deployment

1. Test all features in production
2. Monitor error logs
3. Setup automated backups
4. Configure SSL/TLS certificates
5. Setup email notifications for alerts

## Support

For deployment issues, refer to the specific platform's documentation or contact support.

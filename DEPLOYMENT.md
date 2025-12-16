# KAI Platform - Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Production Checklist](#production-checklist)

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API Key

### Quick Start

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add OPENAI_API_KEY
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

---

## Docker Deployment

### Using Docker Compose

```bash
# Set environment variables
export OPENAI_API_KEY=your_key_here

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

**Backend:**
```bash
cd backend
docker build -t kai-backend .
docker run -p 8000:8000 --env-file .env kai-backend
```

**Frontend:**
```bash
cd frontend
docker build -t kai-frontend .
docker run -p 3000:3000 kai-frontend
```

---

## Cloud Deployment

### Backend Deployment

#### AWS (Elastic Beanstalk)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p python-3.11 kai-backend

# Create environment
eb create kai-backend-env

# Deploy
eb deploy

# Set environment variables
eb setenv OPENAI_API_KEY=your_key_here DATABASE_URL=your_db_url
```

#### Google Cloud (Cloud Run)

```bash
# Build and push container
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/kai-backend

# Deploy
gcloud run deploy kai-backend \
  --image gcr.io/YOUR_PROJECT/kai-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your_key_here
```

#### Azure (App Service)

```bash
# Create resource group
az group create --name kai-rg --location eastus

# Create App Service plan
az appservice plan create --name kai-plan --resource-group kai-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group kai-rg --plan kai-plan --name kai-backend --runtime "PYTHON:3.11"

# Deploy
cd backend
az webapp up --name kai-backend --resource-group kai-rg

# Set environment variables
az webapp config appsettings set --resource-group kai-rg --name kai-backend --settings OPENAI_API_KEY=your_key_here
```

### Frontend Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Production deployment
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`: Your backend URL

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
npm run build
netlify deploy --prod --dir=.next
```

#### AWS (S3 + CloudFront)

```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync out/ s3://your-bucket-name

# Create CloudFront distribution
aws cloudfront create-distribution --origin-domain-name your-bucket-name.s3.amazonaws.com
```

### Database Setup

#### PostgreSQL on AWS RDS

```bash
# Create DB instance
aws rds create-db-instance \
  --db-instance-identifier kai-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YourPassword123 \
  --allocated-storage 20

# Get endpoint
aws rds describe-db-instances --db-instance-identifier kai-db
```

Update backend `DATABASE_URL`:
```
postgresql://admin:YourPassword123@endpoint:5432/kai
```

---

## Production Checklist

### Security
- [ ] Change all default passwords and secrets
- [ ] Set strong `SECRET_KEY` in backend
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up API rate limiting
- [ ] Enable database encryption
- [ ] Use environment variables for all secrets
- [ ] Set up firewall rules

### Performance
- [ ] Enable Redis caching
- [ ] Configure CDN for frontend assets
- [ ] Set up database connection pooling
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Configure proper logging
- [ ] Set up monitoring (DataDog, New Relic, etc.)

### Reliability
- [ ] Set up automated backups
- [ ] Configure health checks
- [ ] Set up error tracking (Sentry)
- [ ] Enable auto-scaling
- [ ] Set up load balancing
- [ ] Configure retry logic
- [ ] Set up alerts and notifications

### Backend Configuration

**Production `.env`:**
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379

# Security
SECRET_KEY=very-strong-secret-key-change-this
DEBUG=False

# CORS
CORS_ORIGINS=["https://yourdomain.com"]

# API Settings
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend Configuration

**Production `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Monitoring

#### Health Check Endpoints
- Backend: `GET /api/v1/health`
- Frontend: `GET /api/health` (if needed)

#### Set Up Monitoring

**Using Uptime Robot:**
```bash
# Monitor backend health
https://api.yourdomain.com/api/v1/health

# Monitor frontend
https://yourdomain.com
```

**Using DataDog:**
```python
# Add to backend/main.py
from ddtrace import tracer
tracer.configure(hostname='datadoghq.com')
```

### Backup Strategy

**Database Backups:**
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

**File Backups:**
```bash
# Upload to S3
aws s3 sync ./data s3://your-backup-bucket/data
```

### CI/CD Pipeline

**GitHub Actions Example:**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Cloud Run
        run: |
          gcloud auth activate-service-account --key-file=${{ secrets.GCP_KEY }}
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT }}/kai-backend
          gcloud run deploy kai-backend --image gcr.io/${{ secrets.GCP_PROJECT }}/kai-backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --token=${{ secrets.VERCEL_TOKEN }} --prod
```

### Scaling Considerations

**Backend Scaling:**
- Use Gunicorn/Uvicorn workers: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`
- Enable Redis for caching
- Use database read replicas
- Implement request queuing

**Frontend Scaling:**
- Use CDN (Cloudflare, AWS CloudFront)
- Enable edge caching
- Implement service workers
- Use lazy loading

### Cost Optimization

**Development Environment:**
- Use SQLite for local development
- Use free tiers (Vercel, Heroku)
- Minimize API calls

**Production Environment:**
- Right-size instances
- Use reserved instances
- Enable auto-scaling with min/max limits
- Monitor and optimize API usage
- Implement caching aggressively

---

## Support & Maintenance

### Logs

**Backend logs:**
```bash
# Local
tail -f logs/app.log

# Docker
docker-compose logs -f backend

# Cloud
# AWS: CloudWatch
# GCP: Cloud Logging
# Azure: Application Insights
```

**Frontend logs:**
```bash
# Vercel
vercel logs

# Netlify
netlify logs
```

### Troubleshooting

**Backend not starting:**
1. Check environment variables
2. Verify database connection
3. Check OpenAI API key
4. Review logs

**Frontend not connecting:**
1. Verify `NEXT_PUBLIC_API_URL`
2. Check CORS settings
3. Verify backend is running
4. Check network connectivity

### Updates

```bash
# Update dependencies
cd backend && pip install -r requirements.txt --upgrade
cd frontend && npm update

# Apply database migrations
python manage.py migrate  # If using migrations

# Restart services
docker-compose restart
```

---

## Questions?

For deployment issues, contact: support@kai-shop.com

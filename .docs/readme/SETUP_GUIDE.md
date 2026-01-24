/**
 * Professional Multi-Subdomain Application Setup Guide
 * Complete deployment and configuration guide
 * 
 * @module SetupGuide
 * @description Comprehensive setup guide for enterprise deployment
 * @version 3.0.0
 */

# 🚀 Professional Multi-Subdomain Application Setup Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Development Setup](#development-setup)
4. [Production Deployment](#production-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Configuration](#configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

## 🔧 Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **MongoDB**: 6.0.0 or higher
- **Redis**: 7.0.0 or higher
- **Docker**: 20.10.0 or higher (optional)
- **Git**: 2.30.0 or higher

### Development Tools

- **VS Code** with recommended extensions
- **Postman** or **Insomnia** for API testing
- **MongoDB Compass** for database management
- **Redis Insight** for Redis management

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/winfoa/cms-winfoa.git
cd cms-winfoa
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
# Copy environment template
cp .env.template .env.local

# Edit environment variables
nano .env.local
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access Application

- **Main Application**: http://localhost:3000
- **Auth Subdomain**: http://auth.localhost:3000
- **Dashboard**: http://app.localhost:3000
- **Admin Panel**: http://god.localhost:3000
- **User Account**: http://account.localhost:3000
- **User Management**: http://ump.localhost:3000
- **Wallet**: http://wallet.localhost:3000

## 💻 Development Setup

### Environment Configuration

1. **Copy Configuration Files**

```bash
# Copy all professional configuration files
cp tsconfig.professional.json tsconfig.json
cp .eslintrc.professional.js .eslintrc.js
cp .prettierrc.professional .prettierrc
cp next.config.professional.ts next.config.ts
cp package.professional.json package.json
```

2. **Setup Environment Variables**

```bash
# Development environment
cp .env.template .env.local

# Edit the file with your configuration
nano .env.local
```

3. **Database Setup**

```bash
# Start MongoDB
mongod --dbpath /usr/local/var/mongodb

# Start Redis
redis-server
```

4. **Install Dependencies**

```bash
# Install all dependencies
npm install

# Install development dependencies
npm install --save-dev
```

### Development Scripts

```bash
# Development with Turbo mode
npm run dev

# Development with debugging
npm run dev:debug

# Development with profiling
npm run dev:profile

# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Format code
npm run format
```

## 🏭 Production Deployment

### 1. Environment Setup

```bash
# Copy production environment template
cp .env.production.template .env.production

# Edit with production values
nano .env.production
```

### 2. Build Application

```bash
# Build for production
npm run build

# Build with analysis
npm run build:analyze

# Build with profiling
npm run build:profile
```

### 3. Start Production Server

```bash
# Start production server
npm start

# Start with PM2
pm2 start ecosystem.config.professional.js --env production

# Start with Docker
docker-compose up -d
```

### 4. Domain Configuration

Configure your DNS settings:

```
# A Records
auth.yourdomain.com     → 192.0.2.1
app.yourdomain.com      → 192.0.2.1
god.yourdomain.com      → 192.0.2.1
account.yourdomain.com  → 192.0.2.1
ump.yourdomain.com      → 192.0.2.1
wallet.yourdomain.com   → 192.0.2.1
```

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start development environment
docker-compose --profile dev up

# Start with monitoring
docker-compose --profile monitoring up

# Start with reverse proxy
docker-compose --profile proxy up
```

### Production with Docker

```bash
# Build production image
docker build -f Dockerfile.professional -t winfoa:latest .

# Run production container
docker run -d \
  --name winfoa-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://mongo:27017/winfoa \
  -e REDIS_URL=redis://redis:6379 \
  winfoa:latest
```

### Docker Compose Production

```bash
# Start all services
docker-compose -f docker-compose.professional.yml up -d

# Scale application
docker-compose up -d --scale app=3

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## ⚙️ Configuration

### Application Configuration

Edit `src/config/app.config.ts`:

```typescript
const APP_CONFIG = {
  name: 'Your Application Name',
  version: '1.0.0',
  domains: {
    production: 'yourdomain.com',
    staging: 'staging.yourdomain.com',
  },
  // ... other configurations
};
```

### Subdomain Configuration

Edit subdomain settings in `src/config/subdomains.ts`:

```typescript
export const SUBDOMAINS = {
  AUTH: 'auth',
  DASHBOARD: 'app',
  GOD: 'god',
  MYACCOUNT: 'account',
  UMP: 'ump',
  WALLET: 'wallet',
} as const;
```

### Security Configuration

Configure security settings:

```typescript
// Rate limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

// JWT configuration
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

// Session configuration
SESSION_MAX_AGE=2592000
```

## 📊 Monitoring & Maintenance

### PM2 Management

```bash
# Start with PM2
pm2 start ecosystem.config.professional.js --env production

# Monitor applications
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart all

# Reload application
pm2 reload all

# Stop application
pm2 stop all

# Delete application
pm2 delete all
```

### Performance Monitoring

```bash
# Run Lighthouse CI
npm run perf

# Analyze bundle size
npm run bundle:analyze

# Check performance metrics
npm run perf:audit
```

### Health Checks

```bash
# Application health
curl http://localhost:3000/api/health

# Database health
curl http://localhost:3000/api/health/database

# Redis health
curl http://localhost:3000/api/health/redis
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### 2. Database Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check Redis status
sudo systemctl status redis

# Test connection
mongosh --eval "db.adminCommand('ping')"
redis-cli ping
```

#### 3. Build Failures

```bash
# Clear cache
npm run clean

# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install
```

#### 4. TypeScript Errors

```bash
# Check TypeScript configuration
npm run type-check

# Fix auto-fixable issues
npm run lint:fix
```

### Docker Issues

```bash
# View container logs
docker logs <container-name>

# Check container status
docker ps -a

# Restart container
docker restart <container-name>

# Rebuild container
docker-compose build --no-cache
```

## 🎯 Best Practices

### Code Quality

1. **Use TypeScript Strict Mode**
2. **Follow ESLint Rules**
3. **Write Unit Tests**
4. **Document Your Code**
5. **Use Consistent Naming**

### Security

1. **Use Environment Variables**
2. **Implement Rate Limiting**
3. **Validate All Inputs**
4. **Use HTTPS in Production**
5. **Keep Dependencies Updated**

### Performance

1. **Optimize Images**
2. **Use Code Splitting**
3. **Implement Caching**
4. **Monitor Bundle Size**
5. **Use CDN for Static Assets**

### Deployment

1. **Use CI/CD Pipelines**
2. **Implement Health Checks**
3. **Monitor Application**
4. **Backup Regularly**
5. **Use Blue-Green Deployment**

## 📈 Performance Optimization

### Bundle Optimization

```bash
# Analyze bundle size
npm run bundle:analyze

# Optimize images
npm run optimize:images

# Minimize CSS/JS
npm run build:optimize
```

### Database Optimization

```bash
# Create indexes
npm run db:create-indexes

# Optimize queries
npm run db:optimize-queries

# Monitor performance
npm run db:monitor
```

### Caching Strategy

```bash
# Configure Redis caching
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600

# Enable CDN
CDN_ENABLED=true
CDN_URL=https://cdn.yourdomain.com
```

## 🔧 Maintenance

### Regular Tasks

1. **Update Dependencies**
2. **Monitor Logs**
3. **Check Performance**
4. **Backup Data**
5. **Review Security**

### Automated Tasks

1. **Dependency Updates**
2. **Security Scans**
3. **Performance Tests**
4. **Backup Creation**
5. **Log Rotation**

## 📞 Support

### Getting Help

1. **Check Documentation**
2. **Review Logs**
3. **Search Issues**
4. **Ask Community**
5. **Contact Support**

### Useful Commands

```bash
# System information
node --version
npm --version
docker --version

# Application status
pm2 status
docker ps
systemctl status

# Resource usage
df -h
free -m
top
```

---

## 🎉 Congratulations!

You now have a professional multi-subdomain application running with:

- ✅ **Enterprise-grade architecture**
- ✅ **Performance optimization**
- ✅ **Security implementation**
- ✅ **Monitoring & logging**
- ✅ **CI/CD pipeline**
- ✅ **Docker deployment**
- ✅ **Professional configuration**

Happy coding! 🚀

---

*For more information, visit our [documentation](https://docs.winfoa.com) or [GitHub repository](https://github.com/winfoa/cms-winfoa).*
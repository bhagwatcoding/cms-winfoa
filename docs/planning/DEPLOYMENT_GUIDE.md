# 🚀 COMPLETE DEPLOYMENT GUIDE

**Education Portal - Production Deployment**

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### **✅ What's Ready:**
- [x] 26 pages complete
- [x] 6 subdomains configured
- [x] Session-based auth implemented
- [x] 12 database models
- [x] 4 API routes
- [x] Responsive design
- [x] Dark mode
- [x] Animations
- [x] Documentation

### **⏳ What's Pending:**
- [ ] Payment gateway integration (optional)
- [ ] Email service setup (optional)
- [ ] SMS service setup (optional)

---

## 🔧 ENVIRONMENT SETUP

### **1. Environment Variables**

Create `.env.production` file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/education
MONGODB_DB_NAME=education_production

# Domain Configuration
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com

# Session
SESSION_SECRET=your-super-secret-session-key-min-32-chars
SESSION_MAX_AGE=604800000

# Optional: Email (if implementing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: SMS (if implementing)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=EDUPORTAL

# Optional: Payment (when ready)
# RAZORPAY_KEY_ID=your-razorpay-key
# RAZORPAY_KEY_SECRET=your-razorpay-secret
```

---

## 🌐 DNS CONFIGURATION

### **Required DNS Records:**

```dns
# A Records
yourdomain.com                    → Your Server IP
*.yourdomain.com                  → Your Server IP (Wildcard)

# Or specific subdomains
god.yourdomain.com                → Your Server IP
center.yourdomain.com             → Your Server IP
api.yourdomain.com                → Your Server IP
auth.yourdomain.com               → Your Server IP
myaccount.yourdomain.com          → Your Server IP
```

### **Verification:**
```bash
# Test DNS propagation
nslookup yourdomain.com
nslookup god.yourdomain.com
nslookup center.yourdomain.com
```

---

## 🔒 SSL CERTIFICATE SETUP

### **Option 1: Let's Encrypt (Free)**

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get wildcard certificate
sudo certbot certonly --manual --preferred-challenges dns \
  -d yourdomain.com -d *.yourdomain.com

# Follow instructions to add DNS TXT record
# Certificate will be saved to:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### **Option 2: Cloudflare (Recommended)**

1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Enable SSL/TLS (Full mode)
4. Enable "Always Use HTTPS"
5. Done! Cloudflare handles SSL automatically

---

## 📦 BUILD & DEPLOYMENT

### **1. Build the Application**

```bash
# Install dependencies
npm install --production

# Build for production
npm run build

# Verify build
ls -la .next/
```

### **2. Deploy to Server**

#### **Option A: VPS (Ubuntu/Debian)**

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2
sudo npm install -g pm2

# 3. Clone/Upload your code
git clone your-repo-url
cd education

# 4. Install dependencies
npm install --production

# 5. Build
npm run build

# 6. Start with PM2
pm2 start npm --name "education-portal" -- start
pm2 save
pm2 startup

# 7. Configure Nginx
sudo nano /etc/nginx/sites-available/education
```

**Nginx Configuration:**

```nginx
# Main domain
server {
    listen 80;
    server_name yourdomain.com *.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/education /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### **Option B: Vercel (Easiest)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure domains in Vercel dashboard
# Add: yourdomain.com, god.yourdomain.com, etc.
```

#### **Option C: Docker**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build & Run
docker build -t education-portal .
docker run -d -p 3000:3000 --env-file .env.production education-portal
```

---

## 🗄️ DATABASE SETUP

### **MongoDB Atlas (Recommended)**

1. Create account at mongodb.com/cloud/atlas
2. Create new cluster
3. Add database user
4. Whitelist IP (0.0.0.0/0 for all IPs)
5. Get connection string
6. Update MONGODB_URI in .env.production

### **Self-hosted MongoDB**

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use education_production
db.createUser({
  user: "eduadmin",
  pwd: "strong-password",
  roles: ["readWrite"]
})
```

---

## 🔐 SECURITY CHECKLIST

- [ ] Use strong SESSION_SECRET (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] Backup strategy in place

---

## 📊 MONITORING & MAINTENANCE

### **1. Application Monitoring**

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs education-portal

# Restart if needed
pm2 restart education-portal
```

### **2. Database Backups**

```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/mongodb_$DATE"

# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh
```

### **3. Log Rotation**

```bash
# Configure PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🧪 TESTING AFTER DEPLOYMENT

### **1. Test All Subdomains:**

```bash
# Landing
curl https://yourdomain.com

# God Panel
curl https://god.yourdomain.com

# Center Portal
curl https://center.yourdomain.com

# Auth Service
curl https://auth.yourdomain.com

# MyAccount
curl https://myaccount.yourdomain.com

# API
curl https://api.yourdomain.com/api/health
```

### **2. Test Authentication:**
1. Visit auth.yourdomain.com/login
2. Try to login
3. Verify session cookie
4. Test protected routes

### **3. Test Database:**
1. Create a test user
2. Create a test transaction
3. Verify data in MongoDB
4. Test API endpoints

---

## 🚨 TROUBLESHOOTING

### **Issue: Pages not loading**
```bash
# Check if app is running
pm2 status

# Check logs
pm2 logs education-portal --lines 100

# Restart
pm2 restart education-portal
```

### **Issue: Subdomain not working**
```bash
# Check DNS
nslookup subdomain.yourdomain.com

# Check Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### **Issue: Database connection failed**
```bash
# Test MongoDB connection
mongo "$MONGODB_URI"

# Check if MongoDB is running
sudo systemctl status mongod

# Check firewall
sudo ufw status
```

---

## 📈 PERFORMANCE OPTIMIZATION

### **1. Enable Caching**

```nginx
# Add to Nginx config
location /_next/static/ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}

location /images/ {
    expires 30d;
    add_header Cache-Control "public";
}
```

### **2. Enable Compression**

```nginx
# Add to Nginx config
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

### **3. Database Indexing**

All models already have proper indexes! ✅

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] All 26 pages accessible
- [ ] All 6 subdomains working
- [ ] HTTPS enabled
- [ ] Authentication working
- [ ] Database connected
- [ ] API endpoints responding
- [ ] Logs being collected
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Documentation updated

---

## 🎉 DEPLOYMENT COMPLETE!

Your Education Portal is now live and ready for users!

**Access URLs:**
- Landing: https://yourdomain.com
- God Panel: https://god.yourdomain.com
- Center Portal: https://center.yourdomain.com
- Auth: https://auth.yourdomain.com
- MyAccount: https://myaccount.yourdomain.com

---

**Need Help?** Check the documentation in `docs/planning/`

**Questions?** All features are documented and ready to use!

**Ready to scale?** The architecture supports it! 🚀

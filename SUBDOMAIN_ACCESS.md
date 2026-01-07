# WINFOA Subdomain Access Guide

## 🌐 Subdomain Architecture

Your application uses professional subdomain-based routing for multi-tenant functionality.

## ✅ Production-Ready Subdomain Structure

### Available Subdomains:

| Subdomain | Purpose | URL (Development) | Requires Auth |
|-----------|---------|-------------------|---------------|
| **www / root** | Landing & Marketing | http://localhost:3000 | ❌ No |
| **auth** | Authentication Hub | http://auth.localhost:3000 | ❌ No |
| **god** | Super Admin Panel | http://god.localhost:3000 | ✅ Yes |
| **ump** | User Management Portal | http://ump.localhost:3000 | ✅ Yes |
| **skills** | Skills/Education Portal | http://skills.localhost:3000 | ✅ Yes |
| **myaccount** | User Account Dashboard | http://myaccount.localhost:3000 | ✅ Yes |
| **api** | API Gateway | http://api.localhost:3000 | Varies |

## 📋 Subdomain to App Folder Mapping

The proxy automatically routes subdomains to their respective app folders:

```
auth.localhost:3000       →  /src/app/auth/*
god.localhost:3000        →  /src/app/provider/*
ump.localhost:3000        →  /src/app/ump/*
skills.localhost:3000     →  /src/app/skills/*
myaccount.localhost:3000  →  /src/app/myaccount/*
api.localhost:3000        →  /src/app/api/*
localhost:3000            →  /src/app/* (root)
```

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access Key Pages

**Authentication:**
- Login: http://auth.localhost:3000/login
- Signup: http://auth.localhost:3000/signup
- Forgot Password: http://auth.localhost:3000/forgot-password

**Dashboards:**
- Landing Page: http://localhost:3000
- God Panel: http://god.localhost:3000
- User Management: http://ump.localhost:3000
- Skills Portal: http://skills.localhost:3000
- My Account: http://myaccount.localhost:3000

## 🔐 Authentication Flow

1. User visits protected subdomain (e.g., `god.localhost:3000`)
2. Proxy checks for `auth_session` cookie
3. If not authenticated → Redirects to `auth.localhost:3000/login`
4. After login → Redirects back to original subdomain

## ⚙️ Environment Variables

Ensure your `.env.local` contains:

```env
# Root domain
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_URL=http://auth.localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/winfoa
MONGODB_DB_NAME=winfoa

# Session
SESSION_SECRET=your-secret-key-here
SESSION_MAX_AGE=604800000
```

## 🌍 Production Deployment

### DNS Configuration

Point these subdomains to your server:
```
auth.yourdomain.com      → Your Server IP
god.yourdomain.com       → Your Server IP
ump.yourdomain.com       → Your Server IP
skills.yourdomain.com    → Your Server IP
myaccount.yourdomain.com → Your Server IP
api.yourdomain.com       → Your Server IP
```

### Production Environment Variables

Update `.env.production`:
```env
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_AUTH_URL=https://auth.yourdomain.com
```

## 🛠️ Proxy Configuration

The proxy is configured in `src/proxy.ts` and handles:
- ✅ Subdomain detection and routing
- ✅ Authentication checks
- ✅ Automatic redirects to auth
- ✅ Static asset handling
- ✅ API route passthrough

## 📝 Common Issues & Solutions

### Issue: 404 on subdomains
**Solution:** Make sure you're using `subdomain.localhost:3000`, not `localhost:3000/subdomain`

### Issue: Infinite redirect loop
**Solution:** Check if session cookie is being set correctly and not blocked

### Issue: Subdomain not recognized
**Solution:** Clear browser cache and restart dev server

## 🎯 Best Practices

1. **Always use subdomains** - Never mix path-based and subdomain routing
2. **Test authentication flow** - Ensure redirects work correctly
3. **Check session cookies** - Verify they're shared across subdomains
4. **Use HTTPS in production** - Required for secure cookies

## 📚 Learn More

- Next.js Proxy: https://nextjs.org/docs/messages/middleware-to-proxy
- Subdomain Routing: Next.js middleware patterns
- Session Management: Cookie-based authentication

---

**Need Help?** Check the proxy logic in `src/shared/lib/proxy.ts`

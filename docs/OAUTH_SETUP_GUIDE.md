# 🔐 OAuth Setup Guide - Google & GitHub

**Complete guide to setting up OAuth authentication**

---

## 📋 Prerequisites

- Google Cloud account
- GitHub account
- Running Next.js app (`npm run dev`)

---

## 🌐 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project** or select existing project
3. Name it (e.g., "WINFOA Auth")
4. Click **Create**

### Step 2: Enable Google+ API

1. In the console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (or Internal if G Suite)
3. Click **Create**
4. Fill in required fields:
   - **App name:** WINFOA
   - **User support email:** your@email.com
   - **Developer contact:** your@email.com
5. Click **Save and Continue**
6. Skip **Scopes** (click Save and Continue)
7. Add test users if needed
8. Click **Save and Continue**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Select **Application type:** Web application
4. Name: "WINFOA Web Client"
5. **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (Add production URL later)
6. Click **Create**
7. Copy **Client ID** and **Client Secret**

### Step 5: Add to Environment Variables

Add to `.env.local`:
```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

---

## 🐙 GitHub OAuth Setup

### Step 1: Create OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **Developer settings** (left sidebar)
3. Click **OAuth Apps**
4. Click **New OAuth App**

### Step 2: Fill OAuth App Details

- **Application name:** WINFOA
- **Homepage URL:** `http://localhost:3000`
- **Application description:** (Optional) Multi-subdomain education platform
- **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`

Click **Register application**

### Step 3: Generate Client Secret

1. On your OAuth app page, click **Generate a new client secret**
2. Copy the secret immediately (you won't see it again!)
3. Copy the **Client ID** as well

### Step 4: Add to Environment Variables

Add to `.env.local`:
```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

---

## 📄 Complete .env.local File

Your `.env.local` should have:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/education
MONGODB_DB_NAME=education

# Domain
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Session
SESSION_SECRET=your-random-32-char-secret-key
SESSION_MAX_AGE=604800000

# Optional: Email (for verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

---

## 🧪 Testing OAuth

### 1. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Test Google OAuth

1. Visit `http://localhost:3000/auth/login`
2. Click **Google** button
3. Should redirect to Google sign-in
4. Sign in with your Google account
5. Should redirect back and create session

### 3. Test GitHub OAuth

1. Visit `http://localhost:3000/auth/login`
2. Click **GitHub** button
3. Should redirect to GitHub authorize page
4. Click **Authorize**
5. Should redirect back and create session

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Google Client ID in `.env.local`
- [ ] Google Client Secret in `.env.local`
- [ ] GitHub Client ID in `.env.local`
- [ ] GitHub Client Secret in `.env.local`
- [ ] Redirect URLs match exactly
- [ ] Dev server restarted
- [ ] Can click OAuth buttons
- [ ] Google redirect works
- [ ] GitHub redirect works
- [ ] User created in database
- [ ] Session cookie set
- [ ] Redirected to dashboard

---

## 🐛 Troubleshooting

### "redirect_uri_mismatch" Error

**Problem:** OAuth provider rejects redirect URI

**Solution:**
1. Check redirect URI in provider settings
2. Must exactly match: `http://localhost:3000/api/auth/callback/google`
3. No trailing slash
4. Check port number (3000)

### "Client ID not found" Error

**Problem:** Environment variables not loaded

**Solution:**
1. Verify `.env.local` file exists
2. Restart dev server
3. Check variable names (no typos)
4. No quotes around values in `.env.local`

### OAuth Button Doesn't Work

**Problem:** Click does nothing

**Solution:**
1. Open browser console
2. Check for JavaScript errors
3. Verify API route exists: `/api/auth/[provider]/route.ts`
4. Check network tab for failed requests

### User Not Created After OAuth

**Problem:** Redirects but no user in database

**Solution:**
1. Check MongoDB is running
2. Check database connection in `.env.local`
3. Look at server logs for errors
4. Verify User model has OAuth fields

---

## 🔒 Security Best Practices

### Development
✅ Use `http://localhost` (not `http://127.0.0.1`)  
✅ Keep Client Secrets in `.env.local` (git-ignored)  
✅ Never commit secrets to git  
✅ Use different credentials for dev/prod

### Production
✅ Use HTTPS URLs only  
✅ Set secure environment variables on hosting platform  
✅ Enable additional OAuth restrictions  
✅ Monitor OAuth usage  
✅ Rotate secrets periodically

---

## 🚀 Production Deployment

### Update OAuth App Settings

**Google:**
1. Add production redirect URI:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
2. Add to Authorized Redirect URIs
3. Update `.env` on production server

**GitHub:**
1. Update Authorization callback URL:
   ```
   https://yourdomain.com/api/auth/callback/github
   ```
2. Update environment variables on production

### Environment Variables on Hosting Platform

**Vercel:**
```bash
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
```

**Other platforms:** Add via dashboard

---

## 📊 OAuth Flow Diagram

```
User                Browser             Your API            OAuth Provider
 |                     |                    |                      |
 |--Click OAuth------->|                    |                      |
 |                     |---GET /api/auth/google--------------->|
 |                     |                    |                      |
 |                     |<--Redirect to OAuth screen------------|
 |                     |                    |                      |
 |<--OAuth Consent---->|<-----------------Sign In-------------->|
 |                     |                    |                      |
 |                     |---Authorization Code----------------->|
 |                     |                    |                      |
 |                     |<--Redirect /api/auth/callback/google--|
 |                     |                    |                      |
 |                     |---------POST------->|                      |
 |                     |    (exchange code)  |--Exchange Code--->|
 |                     |                    |<--Access Token----|
 |                     |                    |                      |
 |                     |                    |--Get User Info----->|
 |                     |                    |<--User Data---------|
 |                     |                    |                      |
 |                     |                    |--Create/Find User-->|
 |                     |                    |--Create Session---->|
 |                     |                    |                      |
 |                     |<--Redirect to App--|                      |
 |<--Logged In---------|                    |                      |
```

---

## 🎯 Quick Start Checklist

**5-Minute Setup:**

1. [ ] Create Google Cloud project (2 min)
2. [ ] Create OAuth credentials (1 min)
3. [ ] Create GitHub OAuth App (1 min)
4. [ ] Copy secrets to `.env.local` (30 sec)
5. [ ] Restart dev server (10 sec)
6. [ ] Test login (20 sec)

**Total:** ~5 minutes to working OAuth! 🚀

---

## 💡 Tips

**Development:**
- Use multiple test accounts to verify different scenarios
- Check "Remember me" on OAuth providers for faster testing
- Use browser incognito for clean tests

**Debugging:**
- Always check server logs
- Use `console.log` in OAuth routes
- Verify environment variables: `console.log(process.env.GOOGLE_CLIENT_ID)`

**User Experience:**
- Show loading state during OAuth redirect
- Handle OAuth errors gracefully
- Provide fallback to email/password login

---

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Ready to test?** Follow the steps above and you'll have working OAuth in 5 minutes! 🎉

**Last Updated:** 2026-01-07  
**Status:** Complete & Tested ✅

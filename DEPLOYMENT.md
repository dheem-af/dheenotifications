# 🚀 Production Deployment Guide

This comprehensive guide will walk you through deploying DheeNotifications to production using **Vercel** (frontend) and **Railway** (backend + database).

## 🎯 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Vercel      │    │     Railway     │    │   External      │
│   (Frontend)    │────│   (Backend)     │────│   Services      │
│   Next.js App   │    │   Node.js API   │    │   Gmail/Twilio  │
└─────────────────┘    │   PostgreSQL    │    └─────────────────┘
                       │   Redis         │
                       └─────────────────┘
```

## 📋 Prerequisites

Before deploying, ensure you have:

- GitHub account with your code pushed
- Vercel account (free tier available)
- Railway account (free tier available)
- Gmail account for email service
- Twilio account for SMS service (optional)

## 🚂 Part 1: Railway Deployment (Backend + Database)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Deploy PostgreSQL Database

1. **Create New Project**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Wait for deployment (2-3 minutes)

2. **Get Database Credentials**
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy the `DATABASE_URL` (starts with `postgresql://`)
   - Save this for later!

### Step 3: Deploy Redis Cache

1. **Add Redis Service**
   - In your project, click "New Service"
   - Select "Provision Redis"
   - Wait for deployment

2. **Get Redis Credentials**
   - Click on Redis service
   - Go to "Connect" tab
   - Copy the `REDIS_URL` (starts with `redis://`)
   - Save this for later!

### Step 4: Deploy Backend API

1. **Add Backend Service**
   - Click "New Service"
   - Select "GitHub Repo"
   - Choose your `Dheenotifications` repository
   - Set root directory to `backend`

2. **Configure Environment Variables**
   
   Go to your backend service → "Variables" tab and add:

   ```env
   # Database (from Step 2)
   DATABASE_URL=postgresql://postgres:password@host:port/database
   
   # Redis (from Step 3)
   REDIS_URL=redis://default:password@host:port
   
   # JWT Secret (generate a strong random string)
   JWT_SECRET=your-super-long-random-jwt-secret-key-here
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   
   # SMS Configuration (Twilio)
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   
   # Server Configuration
   PORT=5000
   NODE_ENV=production
   ```

3. **Configure Build Settings**
   - Go to "Settings" tab
   - Set "Build Command": `npm install && npx prisma generate && npx prisma migrate deploy`
   - Set "Start Command": `npm start`

4. **Deploy**
   - Railway will automatically deploy
   - Wait for build to complete (5-10 minutes)
   - Note your backend URL (e.g., `https://your-app.railway.app`)

### Step 5: Setup Database Schema

1. **Run Migrations**
   - Go to your backend service
   - Click "Deploy Logs"
   - Verify migrations ran successfully
   - If not, redeploy the service

### Step 6: Start Worker Process

1. **Add Worker Service**
   - Click "New Service" in your Railway project
   - Select "GitHub Repo" again
   - Choose the same repository
   - Set root directory to `backend`

2. **Configure Worker Environment**
   - Add the same environment variables as backend
   - Set "Start Command": `npm run worker`
   - Deploy

## ▲ Part 2: Vercel Deployment (Frontend)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 2: Deploy Frontend

1. **Import Project**
   - Click "New Project"
   - Import your `Dheenotifications` repository
   - Set "Root Directory" to `frontend`

2. **Configure Environment Variables**
   
   In Vercel dashboard → "Settings" → "Environment Variables":

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

   Replace `your-backend.railway.app` with your actual Railway backend URL.

3. **Deploy**
   - Click "Deploy"
   - Wait for build (3-5 minutes)
   - Your frontend will be live at `https://your-app.vercel.app`

## 🔧 Part 3: Configure External Services

### Gmail Setup (Email Service)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2-factor authentication

2. **Generate App Password**
   - Go to "Security" → "App passwords"
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS` environment variable

3. **Test Email**
   - Send a test notification from your app
   - Check if email is delivered

### Twilio Setup (SMS Service) - Optional

1. **Create Twilio Account**
   - Sign up at [twilio.com](https://twilio.com)
   - Verify your phone number

2. **Get Credentials**
   - Go to Console Dashboard
   - Copy Account SID and Auth Token
   - Get a Twilio phone number

3. **Update Environment Variables**
   - Add Twilio credentials to Railway backend service
   - Redeploy the service

## 🔄 Part 4: Final Configuration

### Update CORS Settings

1. **Update Backend CORS**
   
   In your `backend/src/server.js`, update CORS configuration:

   ```javascript
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-app.vercel.app', // Add your Vercel URL
       'https://your-custom-domain.com' // If you have custom domain
     ],
     credentials: true
   }));
   ```

2. **Redeploy Backend**
   - Push changes to GitHub
   - Railway will auto-deploy

### Test Production Deployment

1. **Access Your App**
   - Go to your Vercel URL
   - Create a test account
   - Send notifications
   - Check analytics

2. **Verify All Features**
   - ✅ User registration/login
   - ✅ Single notifications
   - ✅ Bulk CSV upload
   - ✅ Analytics dashboard
   - ✅ Notification logs

## 🌐 Part 5: Custom Domain (Optional)

### Vercel Custom Domain

1. **Add Domain**
   - Go to Vercel project settings
   - Click "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation

### Railway Custom Domain

1. **Add Domain**
   - Go to Railway backend service
   - Click "Settings" → "Domains"
   - Add your API subdomain (e.g., `api.yourdomain.com`)

2. **Update Frontend**
   - Update `NEXT_PUBLIC_API_URL` in Vercel
   - Redeploy frontend

## 📊 Part 6: Monitoring & Maintenance

### Railway Monitoring

1. **Check Logs**
   - Monitor deploy logs for errors
   - Check application logs regularly

2. **Database Monitoring**
   - Monitor PostgreSQL usage
   - Set up alerts for high usage

### Vercel Monitoring

1. **Analytics**
   - Enable Vercel Analytics
   - Monitor page performance

2. **Error Tracking**
   - Check function logs
   - Monitor build failures

## 🔒 Part 7: Security Checklist

### Environment Variables
- ✅ All secrets stored in platform environment variables
- ✅ No sensitive data in code
- ✅ Strong JWT secret (32+ characters)

### CORS Configuration
- ✅ Only allow your frontend domain
- ✅ No wildcard (*) origins in production

### Database Security
- ✅ Database URL not exposed
- ✅ Connection pooling configured
- ✅ Regular backups enabled

## 🚨 Troubleshooting

### Common Deployment Issues

**1. Build Failures**
```bash
# Check package.json scripts
# Ensure all dependencies are listed
# Verify Node.js version compatibility
```

**2. Database Connection Issues**
```bash
# Verify DATABASE_URL format
# Check if migrations ran successfully
# Ensure database is accessible from Railway
```

**3. CORS Errors**
```bash
# Update CORS origins in backend
# Verify frontend URL is correct
# Check if credentials are enabled
```

**4. Environment Variable Issues**
```bash
# Verify all required variables are set
# Check for typos in variable names
# Ensure values are properly formatted
```

### Getting Help

1. **Railway Issues**
   - Check Railway status page
   - Review deploy logs
   - Contact Railway support

2. **Vercel Issues**
   - Check Vercel status page
   - Review function logs
   - Contact Vercel support

## 📈 Part 8: Scaling Considerations

### Performance Optimization

1. **Database Optimization**
   - Add database indexes
   - Implement connection pooling
   - Consider read replicas

2. **Caching Strategy**
   - Implement Redis caching
   - Use CDN for static assets
   - Cache API responses

3. **Queue Optimization**
   - Monitor queue performance
   - Scale worker processes
   - Implement job priorities

### Cost Management

1. **Railway Costs**
   - Monitor resource usage
   - Optimize database queries
   - Scale services as needed

2. **Vercel Costs**
   - Monitor function executions
   - Optimize build times
   - Use edge functions wisely

## 🎉 Deployment Complete!

Congratulations! Your DheeNotifications platform is now live in production. 

### Your Live URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`

### Next Steps:
1. Share your application with potential employers
2. Add it to your resume and portfolio
3. Consider adding more features
4. Monitor performance and user feedback

---

**Your professional notification platform is now ready to impress! 🚀**
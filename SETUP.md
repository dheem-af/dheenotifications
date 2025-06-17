# 🛠️ Local Development Setup Guide

This guide will help you set up the DheeNotifications project on your local machine for development and testing.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Docker** (optional, for database) - [Download here](https://docker.com/)

## 🚀 Step-by-Step Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/dheemanthm2004/Dheenotifications.git

# Navigate to the project directory
cd Dheenotifications

# Check the project structure
ls -la
```

### 2. Setup Database and Redis (Option A: Docker - Recommended)

```bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d

# Verify containers are running
docker ps
```

**What this does:**
- Starts PostgreSQL on port 5432
- Starts Redis on port 6379
- Creates persistent volumes for data

### 2. Setup Database and Redis (Option B: Manual Installation)

If you prefer not to use Docker:

**PostgreSQL:**
- Install PostgreSQL locally
- Create a database named `dheenotifications`
- Note your connection details

**Redis:**
- Install Redis locally
- Start Redis server on default port 6379

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```env
# Database (adjust if using different credentials)
DATABASE_URL="postgresql://postgres:password@localhost:5432/dheenotifications"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-make-it-long-and-random"

# Email Configuration (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Server Configuration
PORT=5000
NODE_ENV="development"
```

**Run database migrations:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) View your database
npx prisma studio
```

**Start the backend server:**
```bash
# Start the API server
npm run dev

# You should see: "Server running on port 5000"
```

### 4. Frontend Setup

Open a **new terminal** and:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
touch .env.local
```

**Configure your `.env.local` file:**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

**Start the frontend:**
```bash
# Start the Next.js development server
npm run dev

# You should see: "Ready - started server on 0.0.0.0:3000"
```

### 5. Start the Worker Process

Open a **third terminal** and:

```bash
# Navigate to backend directory
cd backend

# Start the worker process
npm run worker

# You should see: "Worker started and waiting for jobs..."
```

## 🧪 Testing Your Setup

### 1. Access the Application
- Open your browser and go to: `http://localhost:3000`
- You should see the DheeNotifications login page

### 2. Create a Test Account
- Click "Sign Up"
- Use your real email for testing
- Create an account and login

### 3. Test Single Notification
- Go to "Send Notification"
- Send a test email to yourself
- Check the "Logs" page to see the delivery status

### 4. Test Bulk Upload
- Go to "Bulk Send"
- Create a test CSV file:
  ```csv
  email
  your-email@gmail.com
  test@example.com
  ```
- Upload and send bulk notifications

### 5. Check Analytics
- Go to "Dashboard"
- Verify charts are displaying your test data

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. Database Connection Error**
```bash
# Check if PostgreSQL is running
docker ps
# or
pg_isready -h localhost -p 5432
```

**2. Redis Connection Error**
```bash
# Check if Redis is running
docker ps
# or
redis-cli ping
```

**3. Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

**4. Prisma Migration Issues**
```bash
# Reset database (WARNING: This deletes all data)
npx prisma migrate reset

# Or manually drop and recreate
npx prisma db push --force-reset
```

**5. Email Not Sending**
- Verify your Gmail app password is correct
- Enable 2-factor authentication on Gmail
- Generate an app-specific password

**6. SMS Not Sending**
- Verify Twilio credentials
- Check your Twilio account balance
- Ensure phone number is verified

## 📁 Project Structure Explained

```
Dheenotifications/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.js        # Authentication routes
│   │   │   ├── notify.js      # Notification routes
│   │   │   └── logs.js        # Logs and analytics
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js        # JWT authentication
│   │   │   ├── validation.js  # Input validation
│   │   │   └── security.js    # Security headers
│   │   ├── utils/             # Utility functions
│   │   │   ├── email.js       # Email service
│   │   │   ├── sms.js         # SMS service
│   │   │   └── queue.js       # Queue management
│   │   ├── worker.js          # Background job processor
│   │   └── server.js          # Main server file
│   ├── prisma/                # Database schema
│   │   ├── schema.prisma      # Database models
│   │   └── migrations/        # Database migrations
│   ├── uploads/               # CSV file uploads
│   └── package.json           # Backend dependencies
├── frontend/                  # Next.js application
│   ├── app/                   # App router pages
│   │   ├── dashboard/         # Analytics dashboard
│   │   ├── login/             # Login page
│   │   ├── signup/            # Registration page
│   │   ├── notify/            # Send notification
│   │   ├── bulk-send/         # Bulk upload
│   │   └── logs/              # Notification logs
│   ├── components/            # Reusable components
│   │   ├── Layout.tsx         # Main layout
│   │   └── Navigation.tsx     # Navigation bar
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/                   # Utilities
│   │   ├── api.ts             # API client
│   │   └── auth.ts            # Auth utilities
│   └── package.json           # Frontend dependencies
├── docker-compose.yml         # Docker services
├── README.md                  # Project documentation
└── SETUP.md                   # This setup guide
```

## 🔄 Development Workflow

### Making Changes

1. **Backend Changes:**
   - Edit files in `backend/src/`
   - Server auto-restarts with nodemon
   - Check terminal for errors

2. **Frontend Changes:**
   - Edit files in `frontend/app/` or `frontend/components/`
   - Browser auto-refreshes
   - Check browser console for errors

3. **Database Changes:**
   - Edit `backend/prisma/schema.prisma`
   - Run `npx prisma migrate dev`
   - Generate new client: `npx prisma generate`

### Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run worker       # Start worker process
npx prisma studio    # Open database GUI
npx prisma migrate dev # Run migrations

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Check code quality

# Docker
docker-compose up -d    # Start services
docker-compose down     # Stop services
docker-compose logs     # View logs
```

## 🎯 Next Steps

Once your local setup is working:

1. **Customize the application** for your needs
2. **Add new features** or modify existing ones
3. **Test thoroughly** with real email/SMS services
4. **Deploy to production** using the deployment guide

## 💡 Tips for Development

1. **Use environment variables** for all sensitive data
2. **Test with real services** (Gmail, Twilio) for accurate results
3. **Monitor logs** in all three terminals while developing
4. **Use Prisma Studio** to inspect database changes
5. **Check browser console** for frontend errors
6. **Use Postman** to test API endpoints directly

## 🆘 Getting Help

If you encounter issues:

1. Check the terminal logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all services (PostgreSQL, Redis) are running
4. Check the troubleshooting section above
5. Create an issue on GitHub with detailed error information

---

**Happy coding! 🚀**
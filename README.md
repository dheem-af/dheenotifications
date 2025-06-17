# 🔔 DheeNotifications - Professional Notification Platform

A modern, scalable notification platform built with Next.js, Node.js, PostgreSQL, and Redis. Features secure authentication, bulk notifications, real-time analytics, and professional UI/UX.

![DheeNotifications Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20PostgreSQL%20%7C%20Redis-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Live Demo

- **Frontend**: [https://dheenotifications.vercel.app](https://dheenotifications.vercel.app)
- **API**: [https://dheenotifications-api.railway.app](https://dheenotifications-api.railway.app)

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based secure authentication
- Password hashing with bcryptjs
- Protected routes and user isolation
- Rate limiting and security headers
- Input validation and sanitization

### 📦 **Notification System**
- **Multi-channel delivery**: Email, SMS, In-App
- **Single notifications**: Send to individual recipients
- **Bulk notifications**: CSV upload for mass delivery
- **Scheduled delivery**: Send notifications at specific times
- **Queue processing**: Redis-based job queue with retry logic

### 📊 **Analytics Dashboard**
- Real-time notification metrics
- Success/failure rate tracking
- Channel usage statistics
- Daily trends visualization
- Interactive charts with Chart.js

### 🧾 **Audit & Logging**
- Complete notification history
- Status tracking (success/failed/retrying)
- Pagination and filtering
- Attempt count and error details
- User-specific data isolation

### 🎨 **Professional UI/UX**
- Modern Next.js + Tailwind CSS design
- Responsive and accessible interface
- Real-time toast notifications
- Professional branding and navigation
- Mobile-optimized layouts

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Headless UI
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### **Backend**
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with Bull Queue
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer for CSV processing
- **Security**: Helmet, CORS, Rate Limiting

### **Infrastructure**
- **Database**: PostgreSQL (Railway/Supabase)
- **Cache**: Redis (Railway/Upstash)
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Railway
- **File Storage**: Local/Cloud storage

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis instance
- Email service (SMTP)
- SMS service (Twilio)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/dheemanthm2004/Dheenotifications.git
   cd Dheenotifications
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npx prisma migrate dev
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Start Worker (separate terminal)**
   ```bash
   cd backend
   npm run worker
   ```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
Dheenotifications/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation, security
│   │   ├── utils/          # Helpers and utilities
│   │   └── worker.js       # Queue worker
│   ├── prisma/             # Database schema and migrations
│   ├── uploads/            # CSV file uploads
│   └── package.json
├── frontend/               # Next.js application
│   ├── app/                # App router pages
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities and API client
│   └── package.json
├── docker-compose.yml      # Local development setup
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dheenotifications"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email (SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Server
PORT=5000
NODE_ENV="development"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

## 🐳 Docker Development

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Run migrations
cd backend && npx prisma migrate dev

# Start backend
npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Start worker (new terminal)
cd backend && npm run worker
```

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Notifications
- `POST /notify/send` - Send single notification
- `POST /notify/bulk` - Upload CSV for bulk notifications
- `POST /notify/schedule` - Schedule notification

### Logs & Analytics
- `GET /logs` - Get notification logs (paginated)
- `GET /logs/analytics` - Get analytics data

## 🧪 Testing

### Test User Credentials
- **Email**: dheemanthmadaiah@gmail.com
- **Phone**: +919686490654

### CSV Format for Bulk Upload
```csv
email
user1@example.com
user2@example.com
user3@example.com
```

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Railway (Backend + Database)
1. Connect GitHub repository to Railway
2. Deploy PostgreSQL and Redis services
3. Configure environment variables
4. Deploy backend service

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🔒 Security Features

- **Authentication**: JWT tokens with secure headers
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS**: Configured for production domains
- **Helmet**: Security headers and protection
- **Environment**: Secure credential management

## 📈 Performance

- **Queue System**: Redis-based background processing
- **Database**: Optimized queries with Prisma
- **Caching**: Redis caching for analytics
- **CDN**: Static assets served via Vercel
- **Monitoring**: Error tracking and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dheemanth Madaiah**
- GitHub: [@dheemanthm2004](https://github.com/dheemanthm2004)
- Email: dheemanthmadaiah@gmail.com

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by enterprise notification systems
- Designed for scalability and maintainability

---

⭐ **Star this repository if you found it helpful!**
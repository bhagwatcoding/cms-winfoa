# 🎓 Education Portal - Multi-Subdomain Platform

A comprehensive, enterprise-grade education management platform with **26 beautiful pages** across **6 subdomains**, featuring student management, digital certificates, wallet system, notifications, and real-time analytics.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)
![Pages](https://img.shields.io/badge/Pages-26-purple)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

### 📱 **21 Beautiful Pages**

**Landing Page (1):**
- Modern hero section with gradient design
- Features showcase
- Products display

**God Panel (6):**
- System Dashboard with real-time stats
- Centers Management
- Users Management
- Analytics & Insights
- System Settings

**Center Portal (14):**
- Student Registration List with API integration
- Admit Card Management with download/print
- Digital Certificate Generation
- Real-time Notifications
- Wallet Recharge & Transactions
- Password Management
- Dashboard, Courses, Results, Employees, and more

### 🗄️ **Database Integration**
- 12 Mongoose models with indexes
- 4 RESTful API routes
- Pagination & filtering
- Real-time statistics
- Balance tracking
- Aggregation pipelines

### 🌐 **Multi-Subdomain Architecture**
- `example.com` - Landing page
- `god.example.com` - Super admin panel
- `center.example.com` - Education center portal
- `api.example.com` - API gateway
- `auth.example.com` - Authentication service
- `myaccount.example.com` - User account management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd education

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

### Local Development with Subdomains

Add to your hosts file:
- **Windows:** `C:\Windows\System32\drivers\etc\hosts`
- **Mac/Linux:** `/etc/hosts`

```
127.0.0.1 localhost
127.0.0.1 god.localhost
127.0.0.1 center.localhost
127.0.0.1 api.localhost
127.0.0.1 auth.localhost
127.0.0.1 myaccount.localhost
```

Then access:
- http://localhost:3000 - Landing page
- http://center.localhost:3000 - Center portal
- http://god.localhost:3000 - God panel
- http://api.localhost:3000 - API gateway
- http://auth.localhost:3000 - Auth service
- http://myaccount.localhost:3000 - My account

---

## 📊 Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4.1
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Database:** MongoDB + Mongoose
- **UI Components:** Shadcn UI
- **Authentication:** Session-based

---

## 📁 Project Structure

```
education-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── center/            # Center portal (14 pages)
│   │   └── api/center/        # API routes (4 routes)
│   │
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   └── center/            # Custom components
│   │
│   ├── lib/
│   │   ├── models/edu/        # Database models (12)
│   │   ├── helpers/
│   │   └── utils/
│   │
│   └── proxy.ts               # Multi-subdomain proxy
│
├── docs/
│   └── planning/              # Planning documents
│
└── package.json
```

---

## 🎨 Design System

Each page features unique gradient themes:
- **Registration List:** Blue → Indigo
- **Admit Card:** Orange → Amber
- **Certificates:** Cyan → Blue
- **Notifications:** Purple → Pink
- **Wallet:** Green → Emerald

All pages include:
- ✅ Framer Motion animations
- ✅ Responsive design
- ✅ Search & filter
- ✅ Statistics dashboards
- ✅ Dark mode support

---

## 🔧 Environment Variables

Create `.env.local` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/education
MONGODB_DB_NAME=education

# Domain
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Session
SESSION_SECRET=your-session-secret
SESSION_MAX_AGE=604800000
```

---

## 📚 API Routes

### Transactions
- `GET /api/center/transactions` - List transactions
- `POST /api/center/transactions` - Create transaction

### Notifications
- `GET /api/center/notifications` - List notifications
- `POST /api/center/notifications` - Create notification
- `PATCH /api/center/notifications` - Mark all as read

### Certificates
- `GET /api/center/certificates` - List certificates
- `POST /api/center/certificates` - Create certificate

### Admit Cards
- `GET /api/center/admit-cards` - List admit cards
- `POST /api/center/admit-cards` - Create admit card

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### DNS Configuration

For production, configure DNS:
```
example.com → Your server IP
*.example.com → Your server IP (wildcard)
```

### SSL Certificates

```bash
certbot --nginx -d example.com -d *.example.com
```

---

## 📖 Documentation

Detailed documentation available in `docs/planning/`:
- `MASTER_SUMMARY.md` - Complete project overview
- `MULTI_SUBDOMAIN_PLAN.md` - Architecture details
- `PAGES_IMPLEMENTATION.md` - Page specifications
- And more...

---

## 🎯 Features Roadmap

### Completed ✅
- [x] 14 beautiful pages with animations
- [x] Database integration (12 models)
- [x] API routes (4 endpoints)
- [x] Multi-subdomain architecture
- [x] Landing page
- [x] Wallet system
- [x] Notifications
- [x] Certificates & Admit cards

### Upcoming 🔄
- [ ] God panel pages
- [ ] Auth service pages
- [ ] MyAccount portal pages
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Real-time features (WebSocket)
- [ ] Advanced analytics

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ using Next.js 16, TypeScript, and MongoDB

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for beautiful UI components
- Framer Motion for smooth animations
- MongoDB team for the robust database

---

**⭐ Star this repo if you find it helpful!**

# Winfoa Platform - Multi-Subdomain Full-Stack Web Application

A comprehensive full-stack web development platform featuring specialized subdomains for authentication, learning management, user administration, payments, and developer tools.

![Platform Architecture](https://img.shields.io/badge/Architecture-Multi--Subdomain-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-06B6D4?style=for-the-badge&logo=tailwindcss)

## 🏗️ Platform Architecture

### Multi-Subdomain Structure

The Winfoa platform consists of **8 specialized subdomains**, each serving a specific purpose:

| Subdomain | URL | Purpose | Key Features |
|-----------|-----|---------|-------------|
| **Main** | `localhost:3000` | Landing & Dashboard | Platform overview, subdomain navigation |
| **Auth** | `auth.localhost:3000` | Authentication Portal | Login, Registration, Password Reset, OAuth |
| **Academy** | `academy.localhost:3000` | Learning Platform | Course Management, Student Portal, Certificates |
| **API** | `api.localhost:3000` | API Gateway | REST Endpoints, Documentation, Rate Limiting |
| **UMP** | `ump.localhost:3000` | User Management | User Administration, Role Management, Permissions |
| **Provider** | `provider.localhost:3000` | Provider Portal | Service Management, Client Relations, Analytics |
| **MyAccount** | `myaccount.localhost:3000` | Account Management | Profile Settings, Privacy Controls, Security |
| **Wallet** | `wallet.localhost:3000` | Digital Payments | Payment Processing, Transaction History, Billing |
| **Developer** | `developer.localhost:3000` | Developer Tools | API Documentation, SDK Downloads, Testing Tools |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **MongoDB** (for database)
- Modern web browser with subdomain support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd winfoa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/winfoa
   
   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # API Configuration
   API_BASE_URL=http://api.localhost:3000
   
   # Payment Gateway
   PAYMENT_GATEWAY_KEY=your-payment-key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the platform**
   - Main Platform: http://localhost:3000
   - All subdomains will be accessible automatically

### Subdomain Configuration

The platform uses advanced middleware for subdomain routing. Each subdomain automatically routes to its respective application section.

## 📁 Project Structure

```
winfoa/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (public)/           # Main platform pages
│   │   ├── auth/               # Authentication subdomain
│   │   ├── academy/            # Learning management subdomain
│   │   ├── api/                # API gateway subdomain
│   │   ├── ump/                # User management subdomain
│   │   ├── provider/           # Provider portal subdomain
│   │   ├── myaccount/          # Account management subdomain
│   │   ├── wallet/             # Digital wallet subdomain
│   │   ├── developer/          # Developer tools subdomain
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── features/               # Feature-specific components and logic
│   ├── shared/                 # Shared components and utilities
│   │   ├── components/         # Reusable UI components
│   │   │   └── ui/            # Base UI components (shadcn/ui)
│   │   ├── lib/               # Core utilities and configurations
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript type definitions
│   │   └── actions/           # Server actions
│   └── middleware.ts           # Subdomain routing middleware
├── public/                     # Static assets
├── docs/                       # Documentation
├── scripts/                    # Build and deployment scripts
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Technology Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library with latest features
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first styling
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Document database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler
- **TypeScript** - Static type checking

## 🛠️ Key Features

### 🔐 Multi-Domain Authentication
- Centralized authentication across all subdomains
- JWT-based session management
- OAuth integration support
- Role-based access control (RBAC)

### 📚 Learning Management System
- Course creation and management
- Student enrollment and tracking
- Certificate generation and verification
- Exam and assessment system

### 👥 User Administration
- Comprehensive user management
- Role and permission system
- Employee management
- Activity logging and audit trails

### 💳 Digital Wallet System
- Secure payment processing
- Transaction history and tracking
- Multi-currency support
- Refund and dispute management

### 🔌 Developer API Gateway
- RESTful API endpoints
- Rate limiting and throttling
- API key management
- Interactive documentation
- SDK generation and downloads

### 🏢 Provider Management
- Service provider onboarding
- Client relationship management
- Business analytics and reporting
- Contract and billing management

## 🚦 API Endpoints

### Core API Structure

```typescript
// Main API Information
GET /api                        # Platform overview and endpoints
GET /api/health                 # System health check
GET /api/status                 # Operational status

// Authentication APIs
POST /api/auth/login            # User login
POST /api/auth/register         # User registration
POST /api/auth/logout           # User logout
POST /api/auth/refresh          # Token refresh

// Academy APIs
GET /api/courses                # List courses
POST /api/courses               # Create course
GET /api/students               # List students
POST /api/certificates/generate # Generate certificate

// User Management APIs
GET /api/users                  # List users
POST /api/users                 # Create user
PUT /api/users/:id              # Update user
DELETE /api/users/:id           # Delete user

// Wallet APIs
GET /api/wallet/balance         # Get balance
POST /api/wallet/recharge       # Add funds
POST /api/wallet/transfer       # Transfer funds
GET /api/wallet/transactions    # Transaction history

// Developer APIs
GET /api/dev/keys               # List API keys
POST /api/dev/keys/generate     # Generate API key
GET /api/dev/usage              # Usage statistics
GET /api/dev/docs               # API documentation
```

## 🎨 UI Components

The platform uses a comprehensive design system built with:

- **shadcn/ui** - Modern, accessible components
- **Radix UI** - Headless component primitives
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Custom themes** - Consistent branding across subdomains

### Component Categories
- **Layout Components** - Headers, footers, navigation
- **Form Components** - Inputs, buttons, validation
- **Data Display** - Tables, cards, statistics
- **Feedback** - Alerts, toasts, loading states
- **Navigation** - Menus, breadcrumbs, pagination

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Permission-based route protection
- Session management across subdomains

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting and DDoS protection

### Payment Security
- PCI DSS compliance
- Encrypted payment processing
- Secure tokenization
- Fraud detection and prevention

## 📊 Performance & Scalability

### Optimization Features
- **Server-Side Rendering (SSR)** - Fast initial page loads
- **Static Site Generation (SSG)** - Optimized static content
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Next.js Image component
- **Caching Strategy** - Multi-layer caching system

### Monitoring & Analytics
- Real-time performance monitoring
- Error tracking and reporting
- User behavior analytics
- API usage statistics
- System health metrics

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Production Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker Deployment
```dockerfile
# Dockerfile included for containerized deployment
docker build -t winfoa-platform .
docker run -p 3000:3000 winfoa-platform
```

#### Traditional Hosting
```bash
# Build and export
npm run build
npm run export

# Deploy static files to your hosting provider
```

## 🔧 Configuration

### Subdomain Configuration
The middleware automatically handles subdomain routing. To add new subdomains:

1. Add subdomain configuration in `src/middleware.ts`
2. Create corresponding app directory structure
3. Implement subdomain-specific layout and pages
4. Update API routes if needed

### Database Configuration
```javascript
// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/winfoa'

// Database models are located in src/shared/lib/db/models/
```

### Environment Variables
```env
# Required Environment Variables
NODE_ENV=development|production
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Optional Environment Variables
API_BASE_URL=http://api.localhost:3000
PAYMENT_GATEWAY_KEY=your-payment-key
EMAIL_SERVICE_KEY=your-email-service-key
STORAGE_BUCKET=your-storage-bucket
```

## 📚 Documentation

### API Documentation
- Interactive API docs available at: `http://api.localhost:3000/docs`
- Postman collection: `http://api.localhost:3000/postman`
- SDK documentation: `http://developer.localhost:3000/sdk`

### Development Guides
- [Subdomain Development Guide](docs/subdomain-development.md)
- [API Integration Guide](docs/api-integration.md)
- [Component Library Guide](docs/component-library.md)
- [Database Schema Guide](docs/database-schema.md)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation for API changes
- Ensure responsive design for all components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Comprehensive guides in `/docs`
- **API Support**: `http://developer.localhost:3000/support`
- **Community**: GitHub Discussions
- **Issues**: GitHub Issues

### Contact Information
- **Email**: support@winfoa.com
- **Website**: https://winfoa.com
- **Developer Portal**: `http://developer.localhost:3000`

---

## 🔥 Quick Start Commands

```bash
# Start development with all subdomains
npm run dev

# Access different subdomains
open http://localhost:3000                    # Main platform
open http://auth.localhost:3000               # Authentication
open http://academy.localhost:3000            # Learning platform  
open http://api.localhost:3000                # API gateway
open http://ump.localhost:3000                # User management
open http://provider.localhost:3000           # Provider portal
open http://myaccount.localhost:3000          # Account management
open http://wallet.localhost:3000             # Digital wallet
open http://developer.localhost:3000          # Developer tools
```

**Built with ❤️ by the Winfoa Team**

---

*This is a comprehensive full-stack web development platform showcasing modern web technologies, microservice architecture, and enterprise-grade features. Perfect for educational institutions, service providers, and multi-tenant applications.*
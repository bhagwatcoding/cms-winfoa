# WinfoA - Multi-Subdomain Education Portal

A comprehensive, enterprise-level education management platform built with **Next.js 16**, **TypeScript**, **MongoDB/Mongoose**, and **Tailwind CSS**. Features a robust subdomain-based architecture with session-based authentication, role-based access control, and comprehensive user management.

---

## 🚀 Features

### 🔐 Authentication System
- **Session-Based Authentication** - Secure, cookie-based sessions with 7-day expiration
- **Multi-Subdomain Support** - Single auth system accessible across all subdomains
- **Token Validation** - Real-time session validation and refresh mechanism
- **Secure Cookies** - HttpOnly, Secure (in production), with proper SameSite settings
- **Auto Logout** - Sessions automatically invalidated when user is deactivated

### 👥 User Management Portal (UMP)
- **Complete CRUD Operations** - Create, read, update, delete users
- **Role Management** - 6 role types: super-admin, admin, staff, center, student, user
- **Activation/Deactivation** - Toggle user status with automatic session invalidation
- **Permission System** - Granular permissions with custom overrides
- **Session Management** - View and invalidate user sessions
- **Bulk Operations** - Activate/deactivate multiple users at once

### 🏗️ Subdomain Architecture
| Subdomain | Purpose | Access |
|-----------|---------|--------|
| `auth.localhost:3000` | Login, Signup, Token validation | Public |
| `ump.localhost:3000` | User Management Portal | Admin/Super-Admin |
| `skills.localhost:3000` | Education Portal (Courses, Students, Certificates) | Staff/Center/Admin |
| `myaccount.localhost:3000` | User Profile & Settings | Authenticated Users |
| `wallet.localhost:3000` | Wallet & Transactions | Authenticated Users |
| `provider.localhost:3000` | Service Provider Dashboard | Providers |
| `api.localhost:3000` | API Gateway | Authenticated API Requests |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── auth/
│   │       ├── login/           # POST - User login
│   │       ├── signup/          # POST - User registration
│   │       ├── logout/          # POST - Session logout
│   │       ├── token/           # GET/POST/DELETE - Token operations
│   │       ├── me/              # GET - Current user info
│   │       └── forgot-password/ # POST - Password reset
│   ├── auth/                    # Auth subdomain pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── token/               # Session validation page
│   │   └── forgot-password/
│   ├── ump/                     # User Management Portal
│   │   ├── users/               # User management
│   │   └── page.tsx             # UMP dashboard
│   ├── skills/                  # Education Portal
│   ├── myaccount/              # User account management
│   └── wallet/                 # Wallet & transactions
├── features/                   # Feature-specific modules
│   ├── auth/
│   │   ├── actions/            # Server actions (login, signup, logout)
│   │   ├── components/         # Auth UI components
│   │   └── services/           # Auth business logic
│   ├── ump/
│   │   └── users/
│   │       └── components/     # User management components
│   └── skills/
├── shared/
│   ├── actions/                # Global server actions
│   │   ├── auth/              # Auth actions
│   │   ├── ump/               # UMP actions (user-management.ts)
│   │   ├── users/             # User CRUD actions
│   │   └── skills/            # Skills portal actions
│   ├── lib/
│   │   ├── db/
│   │   │   └── models/        # Mongoose models
│   │   │       ├── core/      # User, Session, Role
│   │   │       ├── account/   # UserPreferences, ActivityLog
│   │   │       └── skills/    # Course, Student, Certificate
│   │   ├── session/           # Session management
│   │   ├── permissions/       # RBAC system
│   │   ├── proxy/             # Subdomain routing
│   │   └── validations/       # Zod schemas
│   ├── components/            # Shared UI components
│   └── types/                 # TypeScript type definitions
└── proxy.ts                   # Next.js 16 proxy entry point
```

---

## 🔑 Authentication Flow

### Login Flow
```
1. User visits auth.localhost:3000/login
2. Enters email and password
3. Server validates credentials
4. Creates session in MongoDB
5. Sets auth_session cookie
6. Redirects to role-appropriate subdomain
```

### Token Validation Flow
```
1. User visits auth.localhost:3000/token
2. Client calls GET /api/auth/token
3. Server validates session cookie
4. Returns user info if valid
5. Redirects to appropriate subdomain
```

### Session Management
```typescript
// Session Cookie Configuration
{
    name: 'auth_session',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}
```

---

## 👤 User Roles & Permissions

### Role Hierarchy
```
super-admin → Full system access (*:*)
    admin → User & employee management
        staff → View & manage students/courses
            center → Center-specific operations
                student → View own data
                    user → Basic access
```

### Permission Format
```
category:action
Examples: users:view, students:create, certificates:manage
Special: *:* (full access)
```

### Permission Categories
- `users` - User management
- `students` - Student management
- `courses` - Course management
- `certificates` - Certificate operations
- `centers` - Center management
- `employees` - Employee management
- `transactions` - Financial operations
- `reports` - Analytics & reports
- `settings` - System settings
- `api` - API access
- `system` - System administration

---

## 🔧 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/logout` | Session logout |
| GET | `/api/auth/token` | Validate session |
| POST | `/api/auth/token` | Refresh session |
| DELETE | `/api/auth/token` | Invalidate session |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Request password reset |

### UMP Endpoints (via Server Actions)
```typescript
// User Management
getUsersAction({ page, limit, search, role, status })
createUserAction(data)
updateUserAction(userId, data)
deleteUserAction(userId)

// Activation/Deactivation
activateUserAction(userId)
deactivateUserAction(userId)
toggleUserStatusAction(userId)

// Role & Permissions
changeUserRoleAction(userId, newRole)
updateUserPermissionsAction(userId, permissions)

// Session Management
getUserSessionsAction(userId)
invalidateUserSessionAction(userId, sessionId)
invalidateAllUserSessionsAction(userId)

// Bulk Operations
bulkActivateUsersAction(userIds)
bulkDeactivateUsersAction(userIds)

// Statistics
getAllSubdomainStatsAction()
getUserActivitySummaryAction(userId)
```

---

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd winfoa
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
```

4. **Update `.env.local`**
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/winfoa

# Domain Configuration
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Session Security (REQUIRED - Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
SESSION_SECRET=your-64-char-minimum-secret-key
SESSION_MAX_AGE=604800000
```

5. **Run development server**
```bash
npm run dev
```

6. **Access the application**
- Auth: http://auth.localhost:3000
- UMP: http://ump.localhost:3000
- Skills: http://skills.localhost:3000
- My Account: http://myaccount.localhost:3000

---

## 🗄️ Database Models

### User Model
```typescript
interface IUser {
    _id: ObjectId;
    umpUserId?: string;          // WIN-YYYY-XXXXXX format
    name: string;
    email: string;
    password?: string;           // Hashed, select: false
    role: 'super-admin' | 'admin' | 'staff' | 'student' | 'user' | 'center';
    status: 'active' | 'inactive' | 'on-leave';
    isActive: boolean;
    emailVerified: boolean;
    phone?: string;
    customPermissions?: string[];
    permissionOverrides?: string[];
    walletBalance?: number;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}
```

### Session Model
```typescript
interface ISession {
    _id: ObjectId;
    userId: ObjectId;
    token: string;               // 32-byte hex token
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
}
```

---

## 🔒 Security Features

### Proxy Security Layer
- **Rate Limiting** - 100 requests per minute per IP
- **Geo-blocking** - Configurable country restrictions
- **Bot Detection** - Automatic bot identification
- **Security Headers** - HSTS, X-Frame-Options, CSP, etc.

### Session Security
- **Cryptographic Tokens** - 32-byte random tokens
- **HttpOnly Cookies** - Prevents XSS access
- **Auto-expiration** - TTL index in MongoDB
- **Deactivation Cascade** - Sessions deleted on user deactivation

### Password Security
- **bcrypt Hashing** - 12 salt rounds
- **Minimum Length** - 6 characters minimum
- **Hidden by Default** - `select: false` in schema

---

## 📋 Development Workflow

### Creating a New Feature
1. Create actions in `src/shared/actions/<feature>/`
2. Create components in `src/features/<subdomain>/<feature>/components/`
3. Create pages in `src/app/<subdomain>/<feature>/`
4. Export actions from `src/shared/actions/index.ts`
5. Add permissions if needed in `src/shared/lib/permissions/constants.ts`

### Adding a New Subdomain
1. Add to `VALID_SUBDOMAINS` in `src/shared/lib/proxy/config.ts`
2. Create handler in `src/shared/lib/proxy/subdomain.ts`
3. Add case in `ProxyHandler.execute()` in `src/shared/lib/proxy/index.ts`
4. Create app directory `src/app/<subdomain>/`

---

## 🧪 Testing

### Test User Accounts
```
Super Admin: superadmin@example.com / password123
Admin: admin@example.com / password123
Staff: staff@example.com / password123
Student: student@example.com / password123
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🤝 Support

For technical support, please contact the development team.

---

**Built with ❤️ using Next.js 16, TypeScript, and MongoDB**

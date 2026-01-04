# 🎓 N.S.D. Education Portal

A modern, full-stack education management system built with Next.js 16, MongoDB, and TypeScript. Features a complete authentication system, student/employee management, course administration, and result tracking.

---

## ✨ Features

### 🔐 Authentication System
- **Session-based Authentication** - Secure cookie-based sessions
- **User Registration** - New user signup with validation
- **Login System** - Email/password authentication
- **Password Reset** - Token-based password recovery
- **Route Protection** - Middleware-based access control
- **Multi-tenant Support** - Subdomain routing for centers

### 👥 User Management
- **Multiple User Roles** - Admin, Staff, Student
- **User Profiles** - Complete user information management
- **Status Management** - Active, Inactive, On-leave

### 🎓 Academic Features
- **Student Management** - Complete student records
- **Course Catalog** - Course creation and management
- **Result Tracking** - Exam results with grades
- **Employee Management** - Staff and teacher records
- **Center Management** - Multi-center support

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Modern, premium aesthetics
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - Engaging user experience
- **Gradient Colors** - Beautiful color schemes
- **Accessible Components** - WCAG compliant

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd education
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/education-portal
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

5. **Run development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
education/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Auth endpoints
│   │   │   └── center/          # Protected APIs
│   │   ├── center/              # Protected center area
│   │   └── layout.tsx           # Root layout
│   │
│   ├── actions/                 # Server actions
│   │   ├── auth.ts             # Login/Register actions
│   │   └── password-reset.ts   # Password reset actions
│   │
│   ├── components/              # React components
│   │   ├── auth/               # Auth components
│   │   ├── center/             # Center-specific components
│   │   └── ui/                 # Reusable UI components
│   │
│   ├── lib/                     # Utilities and configs
│   │   ├── auth.ts             # Auth utilities
│   │   ├── db.ts               # Database connection
│   │   ├── contexts/           # React contexts
│   │   ├── helpers/            # Helper functions
│   │   ├── models/             # Mongoose models
│   │   └── utils.ts            # Utility functions
│   │
│   └── middleware.ts            # Route middleware
│
├── public/                      # Static files
├── .env.local                   # Environment variables
├── AUTHENTICATION.md            # Auth documentation
├── FIXES_AND_IMPROVEMENTS.md   # Changes log
└── README.md                    # This file
```

---

## 🗄️ Database Models

### User Model
- Name, email, password (hashed)
- Role: admin, staff, student
- Status: active, inactive, on-leave
- Center association

### Session Model
- User reference
- Token (secure random)
- Expiration (7 days)
- User agent, IP tracking

### Student Model
- Personal information
- Course enrollment
- Admission details
- Profile image

### Employee Model
- Staff information
- Role and designation
- Department and salary
- Employment details

### Course Model
- Course name and code
- Duration and fees
- Course details

### Result Model
- Student and course reference
- Marks and grades
- Exam date
- Pass/fail status

### Center Model
- Center information
- Multi-tenant support

### PasswordResetToken Model
- Email reference
- Secure token
- 1-hour expiration

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/center/students` - List students
- `POST /api/center/students` - Create student
- `GET /api/center/students/[id]` - Get student
- `PATCH /api/center/students/[id]` - Update student
- `DELETE /api/center/students/[id]` - Delete student
- `GET /api/center/students/stats` - Statistics

### Employees
- `GET /api/center/employees` - List employees
- `POST /api/center/employees` - Create employee
- `GET /api/center/employees/[id]` - Get employee
- `PATCH /api/center/employees/[id]` - Update employee
- `DELETE /api/center/employees/[id]` - Delete employee
- `GET /api/center/employees/stats` - Statistics

### Courses
- `GET /api/center/courses` - List courses
- `POST /api/center/courses` - Create course
- `GET /api/center/courses/[id]` - Get course
- `PATCH /api/center/courses/[id]` - Update course
- `DELETE /api/center/courses/[id]` - Delete course

### Results
- `GET /api/center/results` - List results
- `POST /api/center/results` - Create result
- `GET /api/center/results/[id]` - Get result
- `PATCH /api/center/results/[id]` - Update result
- `DELETE /api/center/results/[id]` - Delete result
- `GET /api/center/results/stats` - Statistics

---

## 🎯 Usage Examples

### Using Auth Context (Client-Side)

```typescript
'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { LogoutButton } from '@/components/auth/logout-button';
import { UserProfile } from '@/components/auth/user-profile';

export function MyComponent() {
  const { user, authenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <div>Please login</div>;

  return (
    <div>
      <UserProfile />
      <p>Welcome, {user?.name}!</p>
      <LogoutButton />
    </div>
  );
}
```

### Server Actions

```typescript
// In your component
'use client';

import { authenticate } from '@/actions/auth';
import { useActionState } from 'react';

export function LoginForm() {
  const [state, dispatch] = useActionState(authenticate, {});

  return (
    <form action={dispatch}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

### Server-Side Auth Check

```typescript
import { getSession, requireAuth } from '@/lib/auth';

// Optional auth
export async function GET() {
  const { user } = await getSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}

// Required auth (throws if not authenticated)
export async function POST() {
  const user = await requireAuth();
  // User is guaranteed to exist
}
```

---

## 🔒 Security Features

### Password Security
- ✅ bcrypt hashing (10 rounds)
- ✅ Minimum 6 characters
- ✅ Password field excluded from queries
- ✅ No plain text storage

### Session Security
- ✅ HttpOnly cookies (XSS protection)
- ✅ Secure flag in production
- ✅ SameSite: Lax (CSRF protection)
- ✅ 7-day expiration
- ✅ Random 32-byte tokens

### Route Protection
- ✅ Middleware-based protection
- ✅ Automatic redirect to login
- ✅ Session validation
- ✅ Public path handling

---

## 🎨 UI Components

### Authentication Components
- `LoginForm` - Email/password login
- `SignupForm` - User registration
- `ForgotPasswordForm` - Password reset request
- `ResetPasswordForm` - Password reset with token
- `LogoutButton` - Logout functionality
- `UserProfile` - Display user info

### UI Components
- `Button` - Custom button component
- `Input` - Form input component
- `Label` - Form label component
- `Card` - Card container component
- `Skeleton` - Loading placeholder

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (Turbopack)
- **Language**: TypeScript 5
- **Database**: MongoDB with Mongoose 9.1.1
- **Authentication**: Session-based (custom)
- **Password**: bcryptjs 3.0.3
- **Validation**: Zod
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **UI**: Custom components

---

## 📚 Documentation

- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Complete auth system docs
- **[FIXES_AND_IMPROVEMENTS.md](./FIXES_AND_IMPROVEMENTS.md)** - Changelog
- **Code Comments** - Inline documentation

---

## 🚧 Development

### Running Tests
```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
```

### Building for Production
```bash
npm run build       # Build production bundle
npm run start       # Start production server
```

### Linting
```bash
npm run lint        # Run ESLint
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
1. Check if MongoDB is running
2. Verify `MONGODB_URI` in `.env.local`
3. Check network connectivity
4. Verify database permissions

### Authentication Not Working
1. Clear browser cookies
2. Check session expiration
3. Verify middleware configuration
4. Check API routes

### Build Errors
1. Delete `.next` folder
2. Run `npm install`
3. Clear node_modules: `rm -rf node_modules && npm install`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

**N.S.D. Education Portal Team**

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database
- All contributors and supporters

---

## 📞 Support

For issues or questions:
- Check [AUTHENTICATION.md](./AUTHENTICATION.md)
- Review [FIXES_AND_IMPROVEMENTS.md](./FIXES_AND_IMPROVEMENTS.md)
- Check code comments
- Open an issue on GitHub

---

**Built with ❤️ using Next.js, MongoDB, and TypeScript**

---

## 🎉 Current Status

✅ **All systems operational!**
- Authentication working
- Database models complete
- API endpoints functional
- UI components ready
- Development server running
- Documentation complete

**Ready for development and deployment! 🚀**

---

*Last Updated: January 4, 2025*
*Version: 1.0.0*

# 🏗️ Subdomain Folder Analysis & Implementation Guide

**Generated:** 2026-01-07  
**Project:** WINFOA - Multi-Subdomain Education Platform

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Subdomain Architecture](#subdomain-architecture)
3. [Implementation Status by Subdomain](#implementation-status-by-subdomain)
4. [Detailed Subdomain Analysis](#detailed-subdomain-analysis)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Best Practices](#best-practices)

---

## 🎯 Overview

This document provides a comprehensive analysis of the subdomain folder structure in the WINFOA project and detailed implementation recommendations for each subdomain.

### Project Structure

```
src/
├── app/                    # Next.js App Router (routes)
│   ├── (auth)/            # Auth route group
│   ├── (public)/          # Public route group
│   ├── api/               # API routes
│   ├── auth/              # Auth pages
│   ├── education/         # Education portal pages
│   ├── myaccount/         # My Account pages
│   └── provider/          # Provider pages
│
└── subdomain/             # Subdomain-specific logic
    ├── api/               # API subdomain logic
    ├── auth/              # Auth subdomain logic
    ├── developer/         # Developer portal logic
    ├── education/         # Education subdomain logic
    ├── myaccount/         # My Account logic
    └── ump/               # UMP (Unified Management Portal)
```

---

## 🌐 Subdomain Architecture

### Subdomain Routing Strategy

The project uses a multi-subdomain architecture:

| Subdomain | Purpose | Status | Priority |
|-----------|---------|--------|----------|
| `example.com` | Landing page | ✅ Active | High |
| `center.example.com` | Education center portal | ✅ Active | High |
| `god.example.com` | Super admin panel | 🔄 Partial | High |
| `api.example.com` | API gateway | 🔄 Partial | Medium |
| `auth.example.com` | Authentication service | ✅ Active | High |
| `myaccount.example.com` | User account management | 🔄 Partial | Medium |
| `developer.example.com` | Developer portal | ⚠️ Planned | Low |
| `ump.example.com` | Unified Management Portal | ⚠️ Planned | Low |

---

## 📊 Implementation Status by Subdomain

### 1. ✅ **Education Subdomain** (Most Complete)

**Path:** `src/subdomain/education/`

**Structure:**
```
education/
├── actions/           # Server Actions (8 files)
│   ├── auth.ts
│   ├── center.ts
│   ├── courses.ts
│   ├── dashboard.ts
│   ├── employees.ts
│   ├── password-reset.ts
│   ├── password.ts
│   └── students.ts
│
├── components/        # React Components (11 files)
│   ├── auth/
│   │   └── reset-password-form.tsx
│   ├── dashboard/
│   │   ├── dashboard-card.tsx
│   │   ├── dashboard-content.tsx
│   │   └── dashboard-grid.tsx
│   ├── employees/
│   │   ├── add-employee-form.tsx
│   │   ├── edit-employee-form.tsx
│   │   └── employees-client.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── main-layout.tsx
│   │   └── sidebar.tsx
│   └── students/
│       └── students-client.tsx
│
├── models/            # Database Models (12 files)
│   ├── AdmitCard.ts
│   ├── Center.ts
│   ├── Certificate.ts
│   ├── Course.ts
│   ├── Employee.ts
│   ├── Notification.ts
│   ├── PasswordResetToken.ts
│   ├── Result.ts
│   ├── Session.ts
│   ├── Student.ts
│   ├── Transaction.ts
│   └── User.ts
│
├── services/          # Business Logic (5 files)
│   ├── course.service.ts
│   ├── employee.service.ts
│   ├── index.ts
│   ├── result.service.ts
│   └── student.service.ts
│
├── lib/              # Utilities
└── types/            # TypeScript types
```

**Status:** 🟢 **Fully Implemented**

**Features:**
- ✅ Complete CRUD operations for Students, Courses, Employees
- ✅ Authentication & Password Reset
- ✅ Dashboard with analytics
- ✅ Wallet & Transactions
- ✅ Digital Certificates & Admit Cards
- ✅ Notifications system
- ✅ 12 Database models with Mongoose
- ✅ 5 Service layers
- ✅ 8 Server Actions

**Implementation Quality:** ⭐⭐⭐⭐⭐ (Excellent)

---

### 2. 🔄 **Auth Subdomain** (Partially Complete)

**Path:** `src/subdomain/auth/`

**Structure:**
```
auth/
├── actions/           # Server Actions (3 files)
│   ├── login.ts
│   ├── logout.ts
│   └── signup.ts
│
├── components/        # React Components (Empty)
├── lib/              # Utilities (Empty)
├── models/           # Database Models (Empty)
├── services/         # Business Logic (Empty)
└── types/            # TypeScript types (Empty)
```

**Status:** 🟡 **Partially Implemented**

**Current Implementation:**
- ✅ Login action
- ✅ Logout action
- ✅ Signup action

**Missing Implementation:**
- ⚠️ Auth components (login/signup forms)
- ⚠️ Auth services (session management, token validation)
- ⚠️ Auth models (could reuse from education)
- ⚠️ Auth utilities (password hashing, JWT)
- ⚠️ OAuth providers (Google, GitHub, etc.)
- ⚠️ Email verification
- ⚠️ 2FA (Two-Factor Authentication)

**Recommended Actions:**
1. Create reusable auth components (LoginForm, SignupForm, etc.)
2. Implement auth services for session management
3. Add OAuth integration
4. Implement email verification flow
5. Add 2FA support

**Priority:** 🔴 **High**

---

### 3. 🔄 **MyAccount Subdomain** (Skeleton Only)

**Path:** `src/subdomain/myaccount/`

**Structure:**
```
myaccount/
├── actions/          # Empty
├── components/       # Empty
├── lib/             # Empty
├── models/          # Empty
├── services/        # Empty
└── types/           # Empty
```

**Status:** 🔴 **Not Implemented**

**Planned Features:**
- Profile management
- Password change
- Email preferences
- Notification settings
- Security settings
- Activity logs
- Connected devices
- API keys management

**Recommended Implementation:**

```typescript
// actions/profile.ts
'use server'
export async function updateProfile(data: UpdateProfileData) {
  // Update user profile
}
export async function changePassword(data: ChangePasswordData) {
  // Change password
}
export async function updateSettings(settings: UserSettings) {
  // Update user settings
}

// components/profile-form.tsx
export function ProfileForm() {
  // Profile editing form
}

// components/security-settings.tsx
export function SecuritySettings() {
  // Security settings (2FA, sessions, etc.)
}

// services/account.service.ts
export class AccountService {
  static async getProfile(userId: string) {}
  static async updateProfile(userId: string, data: any) {}
  static async deleteAccount(userId: string) {}
}
```

**Priority:** 🟡 **Medium**

---

### 4. ⚠️ **API Subdomain** (Skeleton Only)

**Path:** `src/subdomain/api/`

**Structure:**
```
api/
├── actions/          # Empty
├── components/       # Empty (N/A for API)
├── lib/             # Empty
├── models/          # Empty
├── services/        # Empty
└── types/           # Empty
```

**Status:** 🔴 **Not Implemented**

**Planned Features:**
- API Gateway logic
- Rate limiting
- API key management
- Request/response transformers
- API documentation (OpenAPI/Swagger)
- Webhook management
- API analytics

**Recommended Implementation:**

```typescript
// lib/rate-limiter.ts
export class RateLimiter {
  static async checkLimit(apiKey: string) {}
}

// lib/api-validator.ts
export function validateApiRequest(req: Request) {}

// services/api-gateway.service.ts
export class ApiGatewayService {
  static async routeRequest(req: Request) {}
  static async validateApiKey(key: string) {}
}

// models/ApiKey.ts
export const ApiKeySchema = new Schema({
  key: String,
  userId: ObjectId,
  permissions: [String],
  rateLimit: Number,
  expiresAt: Date
})
```

**Priority:** 🟡 **Medium**

---

### 5. ⚠️ **Developer Subdomain** (Skeleton Only)

**Path:** `src/subdomain/developer/`

**Structure:**
```
developer/
├── actions/          # Empty
├── components/       # Empty
├── lib/             # Empty
├── models/          # Empty
├── services/        # Empty
└── types/           # Empty
```

**Status:** 🔴 **Not Implemented**

**Planned Features:**
- Developer dashboard
- API documentation
- Code examples
- SDK downloads
- Webhook simulator
- API testing playground
- Integration guides

**Recommended Implementation:**

```typescript
// components/api-playground.tsx
export function ApiPlayground() {
  // Interactive API testing interface
}

// components/code-examples.tsx
export function CodeExamples() {
  // Multi-language code examples
}

// actions/generate-api-key.ts
export async function generateApiKey() {
  // Generate new API key
}

// lib/documentation-generator.ts
export function generateOpenApiSpec() {
  // Auto-generate API documentation
}
```

**Priority:** 🟢 **Low**

---

### 6. ⚠️ **UMP Subdomain** (Skeleton Only)

**Path:** `src/subdomain/ump/`

**Structure:**
```
ump/
├── actions/          # Empty
├── components/       # Empty
├── lib/             # Empty
├── models/          # Empty
├── services/        # Empty
└── types/           # Empty
```

**Status:** 🔴 **Not Implemented**

**Purpose:** Unified Management Portal (likely for multi-tenant management)

**Planned Features:**
- Tenant management
- Organization settings
- User provisioning
- Billing & subscriptions
- Usage analytics
- Audit logs
- System health monitoring

**Recommended Implementation:**

```typescript
// models/Organization.ts
export const OrganizationSchema = new Schema({
  name: String,
  subdomain: String,
  plan: String,
  users: [ObjectId],
  settings: Object
})

// actions/organization.ts
export async function createOrganization(data: OrgData) {}
export async function updateOrganization(id: string, data: OrgData) {}

// components/org-dashboard.tsx
export function OrganizationDashboard() {
  // Multi-tenant dashboard
}

// services/billing.service.ts
export class BillingService {
  static async createSubscription() {}
  static async cancelSubscription() {}
}
```

**Priority:** 🟢 **Low**

---

## 🛠️ Detailed Subdomain Analysis

### Education Subdomain - Deep Dive

#### Models Architecture

The education subdomain has a well-designed model architecture:

```typescript
// Core Models
- User.ts          → Authentication & user management
- Center.ts        → Education center/branch info
- Student.ts       → Student registration & details
- Employee.ts      → Staff management
- Course.ts        → Course catalog

// Academic Models
- Result.ts        → Exam results & grades
- Certificate.ts   → Digital certificates
- AdmitCard.ts     → Admit cards for exams

// System Models
- Session.ts       → User sessions
- Transaction.ts   → Wallet transactions
- Notification.ts  → In-app notifications
- PasswordResetToken.ts → Password reset tokens
```

#### Service Layer Pattern

The services follow a clean architecture:

```typescript
// Example: student.service.ts
export class StudentService {
  static async getAll(query: QueryParams) {
    // Pagination, filtering, sorting
  }
  
  static async getById(id: string) {
    // Single student retrieval
  }
  
  static async create(data: CreateStudentDto) {
    // Validation + creation
  }
  
  static async update(id: string, data: UpdateStudentDto) {
    // Update with validation
  }
  
  static async delete(id: string) {
    // Soft delete or hard delete
  }
}
```

#### Server Actions Pattern

Server actions provide the bridge between UI and services:

```typescript
// Example: students.ts
'use server'

export async function createStudent(formData: FormData) {
  try {
    const data = StudentSchema.parse(formData)
    const student = await StudentService.create(data)
    return { success: true, data: student }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

## 🚀 Implementation Roadmap

### Phase 1: Core Authentication (Week 1-2)
**Priority:** 🔴 Critical

**Subdomain:** `auth`

**Tasks:**
1. ✅ Implement login/signup/logout actions (Done)
2. ⚠️ Create auth UI components
   - LoginForm.tsx
   - SignupForm.tsx
   - ForgotPasswordForm.tsx
   - ResetPasswordForm.tsx
3. ⚠️ Add session management services
4. ⚠️ Implement email verification
5. ⚠️ Add OAuth providers (Google, GitHub)
6. ⚠️ Create auth middleware

**Deliverables:**
- Fully functional authentication system
- Email verification flow
- OAuth integration
- Session management

---

### Phase 2: User Account Management (Week 3-4)
**Priority:** 🟡 High

**Subdomain:** `myaccount`

**Tasks:**
1. Create account dashboard
2. Implement profile management
   - ProfileForm.tsx
   - AvatarUpload.tsx
   - EmailPreferences.tsx
3. Add security features
   - ChangePasswordForm.tsx
   - TwoFactorSetup.tsx
   - ActiveSessions.tsx
4. Implement notification preferences
5. Add activity logs

**Deliverables:**
- Complete user profile management
- Security settings
- Activity tracking
- Email preferences

---

### Phase 3: API Gateway (Week 5-6)
**Priority:** 🟡 Medium

**Subdomain:** `api`

**Tasks:**
1. Implement API gateway logic
2. Add rate limiting
3. Create API key management
4. Implement request/response transformers
5. Add API analytics
6. Create webhook system

**Deliverables:**
- Functional API gateway
- Rate limiting system
- API key management UI
- Webhook support

---

### Phase 4: Developer Portal (Week 7-8)
**Priority:** 🟢 Low

**Subdomain:** `developer`

**Tasks:**
1. Create developer dashboard
2. Implement API documentation
3. Add code examples (multi-language)
4. Create API playground
5. Add SDK downloads
6. Implement webhook simulator

**Deliverables:**
- Developer documentation portal
- Interactive API playground
- Code examples
- SDK resources

---

### Phase 5: Unified Management Portal (Week 9-10)
**Priority:** 🟢 Low

**Subdomain:** `ump`

**Tasks:**
1. Implement tenant management
2. Add organization settings
3. Create user provisioning system
4. Implement billing & subscriptions
5. Add usage analytics
6. Create audit log system

**Deliverables:**
- Multi-tenant management system
- Billing integration
- Usage analytics
- Audit logs

---

## 📝 Best Practices

### Subdomain Organization

Each subdomain should follow this structure:

```
subdomain/
├── actions/          # Server Actions (Next.js)
│   └── *.ts         # 'use server' functions
│
├── components/       # React Components
│   ├── forms/       # Form components
│   ├── tables/      # Data tables
│   └── ui/          # UI elements
│
├── lib/             # Utilities & Helpers
│   ├── utils.ts     # General utilities
│   └── constants.ts # Constants
│
├── models/          # Database Models (Mongoose)
│   └── *.ts         # Schema definitions
│
├── services/        # Business Logic Layer
│   ├── *.service.ts # Service classes
│   └── index.ts     # Barrel export
│
└── types/           # TypeScript Types
    ├── *.types.ts   # Type definitions
    └── index.ts     # Barrel export
```

### Naming Conventions

**Files:**
- Models: `PascalCase.ts` (e.g., `Student.ts`)
- Services: `kebab-case.service.ts` (e.g., `student.service.ts`)
- Actions: `kebab-case.ts` (e.g., `create-student.ts`)
- Components: `kebab-case.tsx` (e.g., `student-form.tsx`)
- Types: `kebab-case.types.ts` (e.g., `student.types.ts`)

**Code:**
- Components: `PascalCase` (e.g., `StudentForm`)
- Functions: `camelCase` (e.g., `createStudent`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_STUDENTS`)
- Types/Interfaces: `PascalCase` (e.g., `StudentData`)

### Code Organization

**1. Server Actions Pattern:**
```typescript
'use server'
import { revalidatePath } from 'next/cache'
import { StudentService } from '@/edu/services'

export async function createStudent(formData: FormData) {
  try {
    const data = Object.fromEntries(formData)
    const student = await StudentService.create(data)
    revalidatePath('/education/students')
    return { success: true, data: student }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

**2. Service Pattern:**
```typescript
export class StudentService {
  static async create(data: CreateStudentDto) {
    await connectDB()
    const student = await Student.create(data)
    return student.toJSON()
  }
  
  static async getAll(query: QueryParams = {}) {
    await connectDB()
    const { page = 1, limit = 10, search } = query
    
    const filter = search ? {
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    } : {}
    
    const students = await Student
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
    
    const total = await Student.countDocuments(filter)
    
    return {
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}
```

**3. Component Pattern:**
```typescript
'use client'
import { useActionState } from 'react'
import { createStudent } from '@/edu/actions/students'

export function StudentForm() {
  const [state, formAction] = useActionState(createStudent, null)
  
  return (
    <form action={formAction}>
      {/* Form fields */}
      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
      <button type="submit">Create Student</button>
    </form>
  )
}
```

---

## 🔗 Cross-Subdomain Integration

### Shared Resources

Some resources should be shared across subdomains:

```typescript
// src/lib/db/mongodb.ts
// Shared database connection

// src/lib/auth/session.ts
// Shared session management

// src/lib/utils/validators.ts
// Shared validation functions

// src/models/shared/
// Shared models (User, Session, etc.)
```

### Import Paths

Use absolute imports with subdomain prefixes:

```typescript
// Good ✅
import { StudentService } from '@/edu/services'
import { loginAction } from '@/auth/actions/login'

// Avoid ❌
import { StudentService } from '../../services'
```

---

## 📈 Implementation Metrics

### Current Status

| Subdomain | Models | Services | Actions | Components | Completion |
|-----------|--------|----------|---------|------------|------------|
| Education | 12 | 5 | 8 | 11 | 100% ✅ |
| Auth | 0 | 0 | 3 | 0 | 30% 🟡 |
| MyAccount | 0 | 0 | 0 | 0 | 0% ⚠️ |
| API | 0 | 0 | 0 | 0 | 0% ⚠️ |
| Developer | 0 | 0 | 0 | 0 | 0% ⚠️ |
| UMP | 0 | 0 | 0 | 0 | 0% ⚠️ |

### Overall Project Completion

```
Total Subdomains: 6
Fully Implemented: 1 (17%)
Partially Implemented: 1 (17%)
Not Started: 4 (66%)

Overall Completion: ~25%
```

---

## 🎯 Next Steps

### Immediate Actions (This Week)

1. **Complete Auth Subdomain** 🔴
   - Create auth UI components
   - Implement session services
   - Add email verification
   - Test OAuth flow

2. **Start MyAccount Subdomain** 🟡
   - Design database schema
   - Create profile components
   - Implement basic CRUD actions

3. **Refactor Shared Code**
   - Move common models to shared location
   - Create shared utility functions
   - Establish import conventions

### Short-term Goals (This Month)

1. Complete Auth subdomain (100%)
2. Complete MyAccount subdomain (100%)
3. Start API Gateway implementation
4. Create comprehensive testing suite
5. Document API endpoints

### Long-term Goals (Next Quarter)

1. Complete all 6 subdomains
2. Implement advanced features (2FA, OAuth, etc.)
3. Add comprehensive monitoring
4. Performance optimization
5. Security audit
6. Production deployment

---

## 📚 Related Documentation

- [Multi-Subdomain Architecture](./planning/MULTI_SUBDOMAIN_PLAN.md)
- [Database Schema](./planning/DATABASE_SCHEMA.md)
- [API Documentation](./planning/API_ROUTES.md)
- [Component Library](./planning/COMPONENTS.md)

---

**Last Updated:** 2026-01-07  
**Version:** 1.0  
**Status:** Active Development

---

**Questions or Suggestions?**  
Feel free to update this document as the project evolves!

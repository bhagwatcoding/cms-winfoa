# N.S.D. Education Portal

## 🎓 Enterprise-Level Education Management System

A modern, full-stack educational branch management system built with Next.js 16, MongoDB, and the latest UI/UX principles.

---

## ✨ Features

### 🏢 **Core Functionality**
- **Student Management** - Complete CRUD operations for student records
- **Admission System** - Streamlined student registration with form validation
- **Course Management** - Dynamic course catalog with pricing and duration
- **Wallet System** - Integrated payment and recharge functionality
- **Transaction History** - Complete financial tracking with credits/debits

### 🎨 **Premium UI/UX**
- **Modern Design** - Clean, professional interface inspired by latest design trends
- **Glassmorphism Effects** - Semi-transparent headers with backdrop blur
- **Smooth Animations** - Micro-interactions on buttons and cards (hover scale effects)
- **Responsive Layout** - Mobile-first design that works on all devices
- **Custom Scrollbars** - Styled scrollbars for enhanced visual appeal
- **Color-Coded Cards** - Vibrant dashboard cards matching your reference design

### 🔧 **Enterprise Architecture**
- **Type Safety** - Full TypeScript implementation across the stack
- **Server Actions** - Next.js 14+ Server Actions for data mutations
- **Database Layer** - Mongoose models with proper schemas and validations
- **Modular Structure** - Well-organized folder hierarchy
- **Reusable Components** - Shadcn-inspired UI component library
- **Constants Management** - Centralized configuration and routes

---

## 📁 Project Structure

```
education/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── admission/                # Student admission form
│   │   ├── admit-card/               # Admit card generation
│   │   ├── api/
│   │   │   └── seed/                 # Database seeding endpoint
│   │   ├── certificate/              # Branch certificates
│   │   ├── change-password/          # Password management
│   │   ├── courses/                  # Course management
│   │   ├── downloads/                # Document downloads
│   │   ├── employees/                # Employee management
│   │   ├── notifications/            # Notification center
│   │   ├── offers/                   # Monthly offers
│   │   ├── results/                  # Exam results
│   │   ├── students/                 # Student dashboard
│   │   ├── support/                  # Contact support
│   │   ├── terms/                    # Terms & conditions
│   │   ├── wallet/
│   │   │   ├── recharge/             # Wallet recharge
│   │   │   └── transactions/         # Transaction history
│   │   ├── layout.tsx                # Root layout with sidebar/header
│   │   ├── page.tsx                  # Dashboard homepage
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── dashboard-card.tsx    # Reusable dashboard card
│   │   ├── layout/
│   │   │   ├── header.tsx            # App header
│   │   │   └── sidebar.tsx           # Navigation sidebar
│   │   └── ui/                       # UI component library
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   │
│   └── lib/
│       ├── actions/                  # Server Actions
│       │   ├── center.ts             # Center management
│       │   ├── courses.ts            # Course CRUD
│       │   └── students.ts           # Student CRUD
│       ├── constants/
│       │   └── index.ts              # App constants and routes
│       ├── models/                   # Mongoose schemas
│       │   ├── Center.ts
│       │   ├── Course.ts
│       │   ├── Student.ts
│       │   └── User.ts
│       ├── types/
│       │   └── index.ts              # TypeScript interfaces
│       ├── db.ts                     # MongoDB connection
│       ├── seed.ts                   # Database seeder
│       └── utils.ts                  # Utility functions
│
├── public/                           # Static assets
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or connection string
- Git (optional)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
Create a `.env.local` file (optional, defaults to local MongoDB):
```env
MONGODB_URI=mongodb://localhost:27017/education
NODE_ENV=development
```

3. **Seed Database** (Optional)
Visit http://localhost:3000/api/seed after starting the server to populate sample data.

4. **Run Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
npm start
```

The application will be available at **http://localhost:3000**

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#005c8a for sidebar, #3b82f6 for accents)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#eab308)
- **Danger**: Red (#ef4444)
- **Neutral**: Slate grays

### Typography
- **Font Family**: System UI stack (optimized for performance)
- **Headings**: Bold, larger sizes for hierarchy
- **Body**: Regular weight, 14px base

### Components
All UI components follow a consistent design language:
- Rounded corners (8-16px)
- Subtle shadows for depth
- Hover states with scale animations
- Focus rings for accessibility

---

## 💾 Database Models

### Center
```typescript
{
  name: string;
  code: string; // e.g., "BR-141"
  address: string;
  contact: string;
  walletBalance: number;
}
```

### Student
```typescript
{
  name: string;
  fatherName: string;
  motherName: string;
  dob: Date;
  gender: 'male' | 'female' | 'other';
  centerId: ObjectId;
  courseId: ObjectId;
  admissionDate: Date;
  status: 'active' | 'completed' | 'dropped';
}
```

### Course
```typescript
{
  name: string;
  code: string;
  duration: string; // e.g., "6 Months"
  fee: number;
}
```

### User
```typescript
{
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  centerId: ObjectId;
  joinedAt: Date;
}
```

---

## 🔌 API Routes

### Seed Database
**GET** `/api/seed`
- Initializes the database with sample center and user data
- Returns: `{ message: "Database seeded successfully" }`

---

## 🎯 Key Features Implemented

### ✅ Dashboard
- Welcome banner with center information
- 15 colorful feature cards with navigation
- Real-time wallet balance display
- Responsive grid layout

### ✅ Admission Form
- Complete student registration form
- Form validation
- File upload for student photos
- Course selection dropdown

### ✅ Student Management
- Statistics cards (Total, Active, Completed, Dropped)
- Student list with status indicators
- Sortable and filterable table

### ✅ Course Catalog
- Card-based course display
- Course details (name, code, duration, fee)
- Student enrollment count
- Edit and view actions

### ✅ Wallet System
- Recharge interface with quick amount selection
- Transaction history with credit/debit indicators
- Balance statistics
- Payment method information

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.1.1 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Database**: MongoDB with Mongoose 9.1.1
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Custom components with class-variance-authority
- **Icons**: Lucide React
- **State Management**: React Server Components + Server Actions

---

## 📝 Development Guidelines

### Code Organization
- **Components**: Use PascalCase for component files
- **Server Actions**: Prefix with "use server" directive
- **Types**: Define in `lib/types/index.ts`
- **Constants**: Centralize in `lib/constants/index.ts`

### Best Practices
- Always use TypeScript interfaces
- Implement proper error handling
- Use Server Actions for data mutations
- Keep components focused and reusable
- Follow the DRY principle

### Git Workflow
```bash
git add .
git commit -m "feat: description of changes"
git push origin main
```

---

## 🔐 Security

- Environment variables for sensitive data
- MongoDB connection with proper error handling
- Input validation on all forms
- Type-safe API routes

---

## 🎓 Sample Data

Default seeded data includes:
- **Center**: RAMDHARI SINGH DINKAR COMPUTER TRAINING CENTER (BR-141)
- **Admin**: Purushottam Singh (purushottam@example.com)
- **Wallet Balance**: ₹107.00
- **Join Date**: September 23, 2023

---

## 📊 Performance

- **Build Time**: ~20 seconds
- **Server Start**: ~3-6 seconds
- **TypeScript Compilation**: ~17 seconds
- **Static Page Generation**: Pre-rendered for optimal performance

---

## 🚧 Future Enhancements

- [ ] Authentication system (NextAuth.js)
- [ ] Real-time notifications
- [ ] PDF generation for certificates
- [ ] Advanced analytics dashboard
- [ ] Multi-branch support
- [ ] Role-based access control (RBAC)
- [ ] Email notifications
- [ ] SMS integration
- [ ] Payment gateway integration
- [ ] Attendance tracking

---

## 📞 Support

For questions or issues, contact support through the **Contact Support** page in the application.

---

## 📄 License

Private - N.S.D. Education Portal © 2024

---

**Built with ❤️ using Next.js and modern web technologies**

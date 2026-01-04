"use client";

import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CreditCard,
  GraduationCap,
  BookOpen,
  Download,
  Award,
  Wallet,
  History,
  Gift,
  FileText,
  UserSquare2,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';

const cards = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/', color: 'bg-[#a7f3ff]' },
  { label: 'New Admission', icon: UserPlus, href: '/admission', color: 'bg-[#e9fa33]' },
  { label: 'Students', icon: Users, href: '/students', color: 'bg-[#5ee679]' },
  { label: 'Admit Card', icon: CreditCard, href: '/admit-card', color: 'bg-[#ff9e7d]' },
  { label: 'Results', icon: GraduationCap, href: '/results', color: 'bg-[#7d8eff]' },
  { label: 'Courses', icon: BookOpen, href: '/courses', color: 'bg-[#98f2d7]' },
  { label: 'Downloads', icon: Download, href: '/downloads', color: 'bg-[#e6d63c]' },
  { label: 'Branch Certificate', icon: Award, href: '/certificate', color: 'bg-[#33f0d1]' },
  { label: 'Wallet Recharge', icon: Wallet, href: '/wallet/recharge', color: 'bg-[#a7a0ff]' },
  { label: 'Wallet Transactions', icon: History, href: '/wallet/transactions', color: 'bg-[#33f0d1]' },
  { label: 'Monthly Offer', icon: Gift, href: '/offers', color: 'bg-[#7080ff]' },
  { label: 'Terms & Conditions', icon: FileText, href: '/terms', color: 'bg-[#ff7b47]' },
  { label: 'Employees', icon: UserSquare2, href: '/employees', color: 'bg-[#14c4ad]' },
  { label: 'Notifications', icon: Bell, href: '/notifications', color: 'bg-[#91dec4]' },
  { label: 'Contact Support', icon: HelpCircle, href: '/support', color: 'bg-[#84cc52]' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8">
        <div className="relative h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-4 border-slate-100 bg-slate-200 flex-shrink-0">
          {/* Replace with actual image in production */}
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
          </div>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 min-w-0 flex-1">
          <h2 className="text-base sm:text-lg md:text-xl font-bold flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span>Welcome</span>
            <span className="text-blue-600">Purushottam Singh</span>
          </h2>
          <div className="mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-800 break-words">
              RAMDHARI SINGH DINKAR COMPUTER TRAINING CENTER{' '}
              <span className="text-blue-600">(BR-141)</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Mohanpur, Bakhri Begusarai, Kalimandir road, ward no.5,
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Begusarai, Bihar-848201
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              Contact: <span className="font-bold">8051434647</span>
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Cards */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {cards.map((card) => (
          <DashboardCard
            key={card.label}
            label={card.label}
            icon={card.icon}
            href={card.href}
            color={card.color}
          />
        ))}
      </section>
    </div>
  );
}

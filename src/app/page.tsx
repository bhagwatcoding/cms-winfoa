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
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-start gap-8">
        <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-slate-100 bg-slate-200">
          {/* Replace with actual image in production */}
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <Users className="h-12 w-12" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Welcome <span className="text-blue-600">Purushottam Singh</span>
          </h2>
          <div className="mt-2 space-y-1">
            <p className="text-sm font-bold text-slate-800 uppercase">
              RAMDHARI SINGH DINKAR COMPUTER TRAINING CENTER <span className="text-blue-600">(BR-141)</span>
            </p>
            <p className="text-sm text-slate-600">
              Mohanpur, Bakhri Begusarai, Kalimandir road, ward no.5,
            </p>
            <p className="text-sm text-slate-600">
              Begusarai, Bihar-848201
            </p>
            <p className="text-sm font-semibold text-slate-800">
              Contact No.: <span className="font-bold">8051434647</span>
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

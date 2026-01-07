"use client";

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
import { DashboardCard } from './dashboard-card';

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

interface DashboardGridProps {
    counts: {
        students?: number;
        courses?: number;
        employees?: number;
    };
}

export function DashboardGrid({ counts }: DashboardGridProps) {
    const cardsWithCounts = cards.map(card => {
        let count = undefined;
        if (card.label === 'Students') count = counts.students;
        if (card.label === 'Courses') count = counts.courses;
        if (card.label === 'Employees') count = counts.employees;
        return { ...card, count };
    });

    return (
        <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {cardsWithCounts.map((card) => (
                <DashboardCard
                    key={card.label}
                    label={card.label}
                    icon={card.icon}
                    href={card.href}
                    color={card.color}
                    count={card.count}
                />
            ))}
        </section>
    );
}

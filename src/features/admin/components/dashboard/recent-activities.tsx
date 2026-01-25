'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/ui';
import { History, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface RecentActivity {
  type: string;
  message: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-pink-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 relative"
              >
                {index !== activities.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-800" />
                )}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${activity.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white font-medium leading-tight">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

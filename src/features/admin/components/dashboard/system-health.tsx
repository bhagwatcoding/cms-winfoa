'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/ui';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface Service {
  name: string;
  status: string;
  uptime: string;
  color: string;
}

interface SystemHealthProps {
  services: Service[];
}

export function SystemHealth({ services }: SystemHealthProps) {
  return (
    <Card className="border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${service.color} animate-pulse`} />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {service.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                  {service.uptime} Uptime
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                  {service.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

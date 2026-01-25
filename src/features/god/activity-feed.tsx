'use client';

import { cn } from '@/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  AlertCircle,
  Info,
  LogIn,
  LogOut,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface ActivityItem {
  id: string;
  type:
    | 'login'
    | 'logout'
    | 'create'
    | 'update'
    | 'delete'
    | 'permission'
    | 'settings'
    | 'info'
    | 'warning'
    | 'error';
  user: {
    name: string;
    email?: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const typeConfig: Record<
  ActivityItem['type'],
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  login: {
    icon: LogIn,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  logout: {
    icon: LogOut,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
  },
  create: {
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  update: {
    icon: Settings,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  delete: {
    icon: AlertCircle,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  permission: {
    icon: Shield,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  settings: {
    icon: Settings,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  info: {
    icon: Info,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  error: {
    icon: AlertCircle,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
  },
};

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function ActivityFeed({
  activities,
  title = 'Recent Activity',
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  className,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className={cn('rounded-xl border bg-card/50 p-4 backdrop-blur-sm', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        {showViewAll && activities.length > maxItems && (
          <button onClick={onViewAll} className="text-sm text-primary hover:underline">
            View all
          </button>
        )}
      </div>

      <div className="space-y-1">
        {displayedActivities.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No recent activity</p>
        ) : (
          displayedActivities.map((activity) => (
            <ActivityItemRow key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}

function ActivityItemRow({ activity }: { activity: ActivityItem }) {
  const config = typeConfig[activity.type];
  const Icon = config.icon;

  return (
    <div className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
      <div className={cn('rounded-lg p-2', config.bgColor)}>
        <Icon className={cn('h-4 w-4', config.color)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={activity.user.avatar} />
            <AvatarFallback className="text-[10px]">
              {activity.user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm font-medium">{activity.user.name}</span>
        </div>

        <p className="mt-0.5 text-sm text-muted-foreground">
          {activity.action}
          {activity.target && (
            <span className="font-medium text-foreground"> {activity.target}</span>
          )}
        </p>
      </div>

      <span className="shrink-0 text-xs text-muted-foreground" suppressHydrationWarning>
        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
      </span>
    </div>
  );
}

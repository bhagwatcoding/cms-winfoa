'use client';

import { DataTable, type ActivityItem, type Column } from '@/features/god';
import { Button } from '@/ui';
import {
  Activity,
  Download,
  Filter,
  User,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Shield,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

// Extended activity log
interface ActivityLog {
  id: string;
  type: ActivityItem['type'];
  userName: string;
  userEmail: string;
  action: string;
  target?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    type: 'login',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    action: 'Logged in',
    target: 'Chrome on Windows',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'create',
    userName: 'Admin',
    userEmail: 'admin@example.com',
    action: 'Created new user',
    target: 'jane.smith@example.com',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'permission',
    userName: 'System',
    userEmail: 'system@internal',
    action: 'Updated role permissions',
    target: 'Staff',
    ipAddress: '127.0.0.1',
    userAgent: 'Internal System',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'update',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    action: 'Modified course',
    target: 'Web Development Basics',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'delete',
    userName: 'Admin',
    userEmail: 'admin@example.com',
    action: 'Revoked API key',
    target: 'Legacy Integration',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'logout',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    action: 'Logged out',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    type: 'settings',
    userName: 'Admin',
    userEmail: 'admin@example.com',
    action: 'Updated system settings',
    target: 'Email notifications',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    type: 'warning',
    userName: 'System',
    userEmail: 'system@internal',
    action: 'Multiple failed login attempts',
    target: 'unknown@attacker.com',
    ipAddress: '45.33.32.156',
    userAgent: 'Unknown',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  login: <LogIn className="h-4 w-4 text-emerald-500" />,
  logout: <LogOut className="h-4 w-4 text-slate-400" />,
  create: <User className="h-4 w-4 text-blue-500" />,
  update: <Edit className="h-4 w-4 text-amber-500" />,
  delete: <Trash2 className="h-4 w-4 text-rose-500" />,
  permission: <Shield className="h-4 w-4 text-purple-500" />,
  settings: <Settings className="h-4 w-4 text-cyan-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-400" />,
  error: <AlertCircle className="h-4 w-4 text-rose-400" />,
};

const columns: Column<ActivityLog>[] = [
  {
    key: 'type',
    header: 'Type',
    className: 'w-16',
    render: (log) => (
      <div className="flex items-center justify-center rounded-lg bg-muted p-2">
        {typeIcons[log.type]}
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Activity',
    render: (log) => (
      <div>
        <p className="font-medium">
          {log.action}
          {log.target && <span className="text-muted-foreground"> • {log.target}</span>}
        </p>
        <p className="text-xs text-muted-foreground">
          by {log.userName} ({log.userEmail})
        </p>
      </div>
    ),
  },
  {
    key: 'ipAddress',
    header: 'IP Address',
    render: (log) => <code className="rounded bg-muted px-2 py-1 text-xs">{log.ipAddress}</code>,
  },
  {
    key: 'timestamp',
    header: 'Timestamp',
    render: (log) => {
      const date = new Date(log.timestamp);
      return (
        <div className="text-sm">
          <p>{date.toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</p>
        </div>
      );
    },
  },
];

export default function ActivityPage() {
  const [dateFilter, setDateFilter] = useState('all');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Activity className="h-6 w-6 text-primary" />
            Activity Logs
          </h1>
          <p className="text-muted-foreground">Complete audit trail of all system activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'today', 'week', 'month'].map((filter) => (
          <Button
            key={filter}
            variant={dateFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateFilter(filter)}
            className="capitalize"
          >
            {filter === 'all' ? 'All Time' : `This ${filter}`}
          </Button>
        ))}
      </div>

      {/* Activity Table */}
      <DataTable
        data={mockActivityLogs}
        columns={columns}
        title="Activity History"
        description="Showing all recorded system activities"
        searchPlaceholder="Search activities..."
        pageSize={10}
      />
    </div>
  );
}

import type { User } from './mockUser';
import { MoreHorizontal, Mail, Shield, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from '@/ui';
import { StatusBadge, type Column } from '../index';

const roleColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'super-admin': 'destructive',
  admin: 'default',
  staff: 'secondary',
  student: 'outline',
  user: 'outline',
  center: 'secondary',
};

export const columns: Column<User>[] = [
  {
    key: 'name',
    header: 'User',
    render: (user) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium"> {user.name} </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            {user.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Role',
    render: (user) => (
      <Badge variant={roleColors[user.role] ?? 'outline'} className="capitalize">
        <Shield className="mr-1 h-3 w-3" />
        {user.role}
      </Badge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (user) => <StatusBadge status={user.status} />,
  },
  {
    key: 'joinedAt',
    header: 'Joined',
    render: (user) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Calendar className="h-3 w-3" />
        {new Date(user.joinedAt).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
    ),
  },
  {
    key: 'actions',
    header: '',
    className: 'w-12',
    render: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];

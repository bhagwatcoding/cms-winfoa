// Mock user data
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  joinedAt: string;
  lastLogin?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'super-admin',
    status: 'active',
    joinedAt: '2024-01-15',
    lastLogin: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-02-20',
    lastLogin: '2024-01-14T15:45:00',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    role: 'admin', // Changed from staff
    status: 'active',
    joinedAt: '2024-03-10',
    lastLogin: '2024-01-13T09:00:00',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    role: 'user', // Changed from student
    status: 'inactive',
    joinedAt: '2024-04-05',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.b@example.com',
    role: 'admin', // Changed from center
    status: 'active',
    joinedAt: '2024-05-12',
    lastLogin: '2024-01-10T14:20:00',
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: 'user', // Changed from staff
    status: 'on-leave',
    joinedAt: '2024-06-18',
  },
  {
    id: '7',
    name: 'Chris Martin',
    email: 'chris.m@example.com',
    role: 'user', // Changed from student
    status: 'active',
    joinedAt: '2024-07-22',
    lastLogin: '2024-01-15T08:15:00',
  },
  {
    id: '8',
    name: 'Amanda Lee',
    email: 'amanda.l@example.com',
    role: 'user',
    status: 'active',
    joinedAt: '2024-08-30',
    lastLogin: '2024-01-12T11:30:00',
  },
];

import { User } from '../../domain/models/User';

export const mockUsers: User[] = [
  // Users from controllers
  {
    id: 'user_1',
    email: 'sarah.johnson@banedonv.com',
    password: 'password',
    name: 'Sarah Johnson',
    role: 'team_manager',
    active: true,
    lastLogin: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SarahJohnson',
  },
  {
    id: 'user_2',
    email: 'alex.rodriguez@banedonv.com',
    password: 'password',
    name: 'Alex Rodriguez',
    role: 'admin',
    active: true,
    lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AlexRodriguez',
  },
  {
    id: 'user_3',
    email: 'emma.davis@banedonv.com',
    password: 'password',
    name: 'Emma Davis',
    role: 'user',
    active: true,
    lastLogin: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 150).toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EmmaDavis',
  },
  {
    id: 'user_4',
    email: 'mike.chen@banedonv.com',
    password: 'password',
    name: 'Mike Chen',
    role: 'team_manager',
    active: true,
    lastLogin: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MikeChen',
  },
  {
    id: 'user_5',
    email: 'robert.wilson@banedonv.com',
    password: 'password',
    name: 'Robert Wilson',
    role: 'admin',
    active: true,
    lastLogin: new Date(Date.now() - 86400000 * 6).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RobertWilson',
  },
  {
    id: 'user_6',
    email: 'lisa.kim@banedonv.com',
    password: 'password',
    name: 'Lisa Kim',
    role: 'user',
    active: true,
    lastLogin: new Date(Date.now() - 86400000 * 7).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 100).toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LisaKim',
  },
  // Original mock users for auth
  {
    id: 'user_admin',
    email: 'admin@banedonv.com',
    password: 'admin123',
    role: 'admin',
    name: 'BanedonV Admin',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BanedonVAdmin',
  },
  {
    id: 'user_demo',
    email: 'user@banedonv.com',
    password: 'user123',
    role: 'user',
    name: 'Demo User',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DemoUser',
  },
  {
    id: 'user_manager',
    email: 'manager@banedonv.com',
    password: 'manager123',
    role: 'team_manager',
    name: 'Team Manager',
    active: true,
    lastLogin: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TeamManager',
  }
];

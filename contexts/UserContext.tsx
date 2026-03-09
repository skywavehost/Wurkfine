
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, Teammate, User } from '../types';

interface UserContextType {
  user: User;
  teamDirectory: Teammate[];
  notifications: Notification[];
  setUser: (user: User) => void;
  setNotifications: (notifications: Notification[]) => void;
  getInitials: (name: string) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: '1',
    firstName: "Ayoko",
    fullName: "Ayoko timilehin",
    email: "ayoko@wurkfine.com",
    avatarColor: "bg-yellow-500",
    initials: "At"
  });

  const [teamDirectory] = useState<Teammate[]>([
    { id: '1', name: "Ayoko timilehin", email: "ayoko@wurkfine.com", initials: "At", color: "bg-yellow-500", isCurrentUser: true },
    { id: '2', name: "Tunde Tunde", email: "tunde@wurkfine.com", initials: "TT", color: "bg-pink-500" },
    { id: '3', name: "Partner Alice", email: "alice@partner.com", initials: "PA", color: "bg-blue-500" },
    { id: '4', name: "Developer Bob", email: "bob@wurkfine.com", initials: "DB", color: "bg-green-500" },
    { id: '5', name: "Account Owner", email: "owner@wurkfine.com", initials: "AO", color: "bg-zinc-700" },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'Teamwork makes work happen!',
      sender: 'Yeti',
      senderAvatar: 'https://skywavehost.com/wp-content/uploads/2026/01/yeti-avatar.png',
      timestamp: '2 hours ago',
      content: 'Inbox is where you get updates, notifications, and messages from your teammates. Send an invite to start collaborating.',
      isUnread: true,
      type: 'message'
    }
  ]);

  return (
    <UserContext.Provider value={{ user, teamDirectory, notifications, setUser, setNotifications, getInitials }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

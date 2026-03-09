
// Exporting shared navigation and view types
export type NavTab = 'Work' | 'Strategy' | 'Workflow' | 'People';
export type WorkspaceView = 'Home' | 'Inbox' | 'My Tasks' | 'Projects' | 'Portfolios' | 'Reporting' | 'Goals' | 'My workspace' | string;

// Fix: Added missing User interface to resolve the import error in UserContext.tsx
export interface User {
  id: string;
  firstName: string;
  fullName: string;
  email: string;
  avatarColor: string;
  initials: string;
}

export interface Teammate {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  isCurrentUser?: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  name: string;
  dueDate: string;
  collaborators: Teammate[]; // Changed from string[] to Teammate[] for dynamic sync
  projects: string[];
  visibility: string;
}

export interface TaskSection {
  id: string;
  title: string;
  tasks: Task[];
  isExpanded: boolean;
}

export interface Portfolio {
  id: string;
  name: string;
  members: Teammate[];
}

export interface ColumnDef {
  id: string;
  name: string;
  type: string;
  width: string;
}

export interface Notification {
  id: string;
  title: string;
  sender: string;
  senderAvatar: string; // URL or color
  timestamp: string;
  content: string;
  isUnread: boolean;
  type: 'message' | 'task' | 'alert';
}

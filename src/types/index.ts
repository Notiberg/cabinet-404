export interface User {
  id: string;
  name: string;
  position: string;
  photo?: string;
  login: string;
  password: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'working' | 'completed' | 'overdue';
  assigneeId: string;
  createdBy: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetalTracking {
  id: string;
  factory: string;
  diameter: string;
  thickness: string;
  melt: string;
  testType: 'DP_tension' | 'technological' | 'metallographic';
  samplesCount: number;
  testEndDate: Date;
  status: 'working' | 'completed' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkClosure {
  id: string;
  factory: string;
  diameter: string;
  thickness: string;
  melt: string;
  startDate: Date;
  endDate: Date;
  status: 'working' | 'completed' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentTracking {
  id: string;
  factory: string;
  diameter: string;
  thickness: string;
  melt: string;
  status: 'working' | 'completed' | 'signing';
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'metal_test' | 'work_closure';
  status: 'working' | 'completed' | 'overdue';
  userId?: string;
}

export interface UserStats {
  userId: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

export type StatusType = 'working' | 'completed' | 'overdue';
export type PriorityType = 'low' | 'medium' | 'high';
export type TestType = 'DP_tension' | 'technological' | 'metallographic';

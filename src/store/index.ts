import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Task, MetalTracking, WorkClosure, DocumentTracking, CalendarEvent } from '../types';
import { MockFirebaseService as FirebaseService } from '../firebase/mock-database';

interface AppState {
  // User management
  currentUser: User | null;
  users: User[];
  
  // Tasks
  tasks: Task[];
  
  // Metal tracking
  metalTracking: MetalTracking[];
  
  // Work closures
  workClosures: WorkClosure[];
  
  // Document tracking
  documentTracking: DocumentTracking[];
  
  // Calendar events
  calendarEvents: CalendarEvent[];
  
  // Firebase subscriptions
  isConnected: boolean;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  initializeFirebaseSubscriptions: () => void;
  setTasks: (tasks: Task[]) => void;
  setMetalTracking: (metals: MetalTracking[]) => void;
  setWorkClosures: (works: WorkClosure[]) => void;
  setDocumentTracking: (documents: DocumentTracking[]) => void;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addMetalTracking: (metal: Omit<MetalTracking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateMetalTracking: (id: string, updates: Partial<MetalTracking>) => void;
  deleteMetalTracking: (id: string) => void;

  addWorkClosure: (work: Omit<WorkClosure, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateWorkClosure: (id: string, updates: Partial<WorkClosure>) => void;
  deleteWorkClosure: (id: string) => void;

  addDocumentTracking: (document: Omit<DocumentTracking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateDocumentTracking: (id: string, updates: Partial<DocumentTracking>) => void;
  deleteDocumentTracking: (id: string) => void;

  updateCalendarEvents: () => void;
}

// Initial users data based on technical requirements
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Антипин Ярослав Алексеевич',
    position: 'Лаборант',
    login: 'antipin',
    password: 'lab2024',
  },
  {
    id: '2',
    name: 'Низиенко Марина Олеговна',
    position: 'Научный сотрудник',
    login: 'nizienko',
    password: 'science2024',
  },
  {
    id: '3',
    name: 'Кошевой Евгений Олегович',
    position: 'Старший научный сотрудник',
    login: 'koshevoy',
    password: 'senior2024',
  },
  {
    id: '4',
    name: 'Гаврилова Полина Александровна',
    position: 'Научный сотрудник',
    login: 'gavrilova',
    password: 'research2024',
  },
  {
    id: '5',
    name: 'Погорелов Егор Васильевич',
    position: 'Руководитель лаборатории',
    login: 'pogorelov',
    password: 'director2024',
  },
];

// const generateId = () => Math.random().toString(36).substr(2, 9);

const checkOverdueStatus = (dueDate: Date): 'working' | 'completed' | 'overdue' => {
  const now = new Date();
  return dueDate < now ? 'overdue' : 'working';
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: initialUsers,
      tasks: [],
      metalTracking: [],
      workClosures: [],
      documentTracking: [],
      calendarEvents: [],
      isConnected: false,

      setCurrentUser: (user) => set({ currentUser: user }),

      // Firebase data setters
      setTasks: (tasks) => {
        set({ tasks });
        get().updateCalendarEvents();
      },

      setMetalTracking: (metalTracking) => {
        set({ metalTracking });
        get().updateCalendarEvents();
      },

      setWorkClosures: (workClosures) => {
        set({ workClosures });
        get().updateCalendarEvents();
      },

      setDocumentTracking: (documentTracking) => {
        set({ documentTracking });
      },

      // Initialize Firebase subscriptions (now using mock service)
      initializeFirebaseSubscriptions: () => {
        try {
          // Subscribe to tasks
          FirebaseService.subscribeToTasks((tasks) => {
            get().setTasks(tasks);
          });

          // Subscribe to metal tracking
          FirebaseService.subscribeToMetalTracking((metals) => {
            get().setMetalTracking(metals);
          });

          // Subscribe to work closures
          FirebaseService.subscribeToWorkClosures((works) => {
            get().setWorkClosures(works);
          });

          // Subscribe to document tracking
          FirebaseService.subscribeToDocumentTracking((documents) => {
            get().setDocumentTracking(documents);
          });

          // Mock service is always "connected"
          set({ isConnected: true });
        } catch (error) {
          console.error('Failed to initialize mock service subscriptions:', error);
          set({ isConnected: false });
        }
      },

      addTask: async (taskData) => {
        const taskWithStatus = {
          ...taskData,
          status: checkOverdueStatus(taskData.dueDate),
        };
        
        try {
          await FirebaseService.addTask(taskWithStatus);
        } catch (error) {
          console.error('Failed to add task:', error);
        }
      },

      updateTask: async (id, updates) => {
        const updatesWithStatus = {
          ...updates,
          ...(updates.dueDate && { status: checkOverdueStatus(updates.dueDate) }),
        };
        
        try {
          await FirebaseService.updateTask(id, updatesWithStatus);
        } catch (error) {
          console.error('Failed to update task:', error);
        }
      },

      deleteTask: async (id) => {
        try {
          await FirebaseService.deleteTask(id);
        } catch (error) {
          console.error('Failed to delete task:', error);
        }
      },

      addMetalTracking: async (metalData) => {
        const metalWithStatus = {
          ...metalData,
          status: checkOverdueStatus(metalData.testEndDate),
        };
        
        try {
          await FirebaseService.addMetalTracking(metalWithStatus);
        } catch (error) {
          console.error('Failed to add metal tracking:', error);
        }
      },

      updateMetalTracking: async (id, updates) => {
        const updatesWithStatus = {
          ...updates,
          ...(updates.testEndDate && { status: checkOverdueStatus(updates.testEndDate) }),
        };
        
        try {
          await FirebaseService.updateMetalTracking(id, updatesWithStatus);
        } catch (error) {
          console.error('Failed to update metal tracking:', error);
        }
      },

      deleteMetalTracking: async (id) => {
        try {
          await FirebaseService.deleteMetalTracking(id);
        } catch (error) {
          console.error('Failed to delete metal tracking:', error);
        }
      },

      addWorkClosure: async (workData) => {
        const workWithStatus = {
          ...workData,
          status: checkOverdueStatus(workData.endDate),
        };
        
        try {
          await FirebaseService.addWorkClosure(workWithStatus);
        } catch (error) {
          console.error('Failed to add work closure:', error);
        }
      },

      updateWorkClosure: async (id, updates) => {
        const updatesWithStatus = {
          ...updates,
          ...(updates.endDate && { status: checkOverdueStatus(updates.endDate) }),
        };
        
        try {
          await FirebaseService.updateWorkClosure(id, updatesWithStatus);
        } catch (error) {
          console.error('Failed to update work closure:', error);
        }
      },

      deleteWorkClosure: async (id) => {
        try {
          await FirebaseService.deleteWorkClosure(id);
        } catch (error) {
          console.error('Failed to delete work closure:', error);
        }
      },

      addDocumentTracking: async (documentData) => {
        const documentWithStatus = {
          ...documentData,
          status: 'working' as const,
        };
        
        try {
          await FirebaseService.addDocumentTracking(documentWithStatus);
        } catch (error) {
          console.error('Failed to add document tracking:', error);
        }
      },

      updateDocumentTracking: async (id, updates) => {
        try {
          await FirebaseService.updateDocumentTracking(id, updates);
        } catch (error) {
          console.error('Failed to update document tracking:', error);
        }
      },

      deleteDocumentTracking: async (id) => {
        try {
          await FirebaseService.deleteDocumentTracking(id);
        } catch (error) {
          console.error('Failed to delete document tracking:', error);
        }
      },

      updateCalendarEvents: () => {
        const state = get();
        const events: CalendarEvent[] = [];

        // Add task events
        state.tasks.forEach((task) => {
          events.push({
            id: `task-${task.id}`,
            title: task.title,
            date: task.dueDate,
            type: 'task',
            status: task.status,
            userId: task.assigneeId,
          });
        });

        // Add metal tracking events
        state.metalTracking.forEach((metal) => {
          events.push({
            id: `metal-${metal.id}`,
            title: `Испытание ${metal.factory}`,
            date: metal.testEndDate,
            type: 'metal_test',
            status: metal.status,
          });
        });

        // Add work closure events
        state.workClosures.forEach((work) => {
          events.push({
            id: `work-${work.id}`,
            title: `Закрытие ${work.factoryName}`,
            date: work.endDate,
            type: 'work_closure',
            status: work.status,
          });
        });

        set({ calendarEvents: events });
      },
    }),
    {
      name: 'app-storage',
      version: 2, 
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          return {
            ...persistedState,
            users: initialUsers,
            currentUser: null, 
          };
        }
        return persistedState;
      },
    }
  )
);

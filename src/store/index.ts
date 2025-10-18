import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Task, MetalTracking, WorkClosure, DocumentTracking, CalendarEvent } from '../types';

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
  
  // Actions
  setCurrentUser: (user: User | null) => void;
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

const generateId = () => Math.random().toString(36).substr(2, 9);

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

      setCurrentUser: (user) => set({ currentUser: user }),

      addTask: (taskData) => {
        const now = new Date();
        const task: Task = {
          ...taskData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          status: checkOverdueStatus(taskData.dueDate),
        };
        
        set((state) => ({ 
          tasks: [...state.tasks, task] 
        }));
        
        get().updateCalendarEvents();
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { 
                  ...task, 
                  ...updates, 
                  updatedAt: new Date(),
                  status: updates.dueDate ? checkOverdueStatus(updates.dueDate) : task.status
                }
              : task
          ),
        }));
        
        get().updateCalendarEvents();
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        
        get().updateCalendarEvents();
      },

      addMetalTracking: (metalData) => {
        const now = new Date();
        const metal: MetalTracking = {
          ...metalData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          status: checkOverdueStatus(metalData.testEndDate),
        };
        
        set((state) => ({ 
          metalTracking: [...state.metalTracking, metal] 
        }));
        
        get().updateCalendarEvents();
      },

      updateMetalTracking: (id, updates) => {
        set((state) => ({
          metalTracking: state.metalTracking.map((metal) =>
            metal.id === id
              ? { 
                  ...metal, 
                  ...updates, 
                  updatedAt: new Date(),
                  status: updates.testEndDate ? checkOverdueStatus(updates.testEndDate) : metal.status
                }
              : metal
          ),
        }));
        
        get().updateCalendarEvents();
      },

      deleteMetalTracking: (id) => {
        set((state) => ({
          metalTracking: state.metalTracking.filter((metal) => metal.id !== id),
        }));
        
        get().updateCalendarEvents();
      },

      addWorkClosure: (workData) => {
        const now = new Date();
        const work: WorkClosure = {
          ...workData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          status: checkOverdueStatus(workData.endDate),
        };
        
        set((state) => ({ 
          workClosures: [...state.workClosures, work] 
        }));
        
        get().updateCalendarEvents();
      },

      updateWorkClosure: (id, updates) => {
        set((state) => ({
          workClosures: state.workClosures.map((work) =>
            work.id === id
              ? { 
                  ...work, 
                  ...updates, 
                  updatedAt: new Date(),
                  status: updates.endDate ? checkOverdueStatus(updates.endDate) : work.status
                }
              : work
          ),
        }));
        
        get().updateCalendarEvents();
      },

      deleteWorkClosure: (id) => {
        set((state) => ({
          workClosures: state.workClosures.filter((work) => work.id !== id),
        }));
        
        get().updateCalendarEvents();
      },

      addDocumentTracking: (documentData) => {
        const now = new Date();
        const document: DocumentTracking = {
          ...documentData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          status: 'working',
        };
        
        set((state) => ({ 
          documentTracking: [...state.documentTracking, document] 
        }));
      },

      updateDocumentTracking: (id, updates) => {
        set((state) => ({
          documentTracking: state.documentTracking.map((document) =>
            document.id === id
              ? { 
                  ...document, 
                  ...updates, 
                  updatedAt: new Date(),
                }
              : document
          ),
        }));
      },

      deleteDocumentTracking: (id) => {
        set((state) => ({
          documentTracking: state.documentTracking.filter((document) => document.id !== id),
        }));
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
            title: `Закрытие ${work.factory}`,
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

import { 
  ref, 
  push, 
  set, 
  update, 
  remove, 
  onValue, 
  off,
  serverTimestamp 
} from 'firebase/database';
import { database } from './config';
import { Task, MetalTracking, WorkClosure, DocumentTracking } from '../types';

export class FirebaseService {
  // Tasks
  static addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const tasksRef = ref(database, 'tasks');
    const newTaskRef = push(tasksRef);
    const taskData = {
      ...task,
      id: newTaskRef.key,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      dueDate: task.dueDate.toISOString(),
    };
    return set(newTaskRef, taskData);
  }

  static updateTask(id: string, updates: Partial<Task>) {
    const taskRef = ref(database, `tasks/${id}`);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
      ...(updates.dueDate && { dueDate: updates.dueDate.toISOString() }),
    };
    return update(taskRef, updateData);
  }

  static deleteTask(id: string) {
    const taskRef = ref(database, `tasks/${id}`);
    return remove(taskRef);
  }

  static subscribeToTasks(callback: (tasks: Task[]) => void) {
    const tasksRef = ref(database, 'tasks');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasks = Object.values(data).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        callback(tasks);
      } else {
        callback([]);
      }
    });
    return () => off(tasksRef, 'value', unsubscribe);
  }

  // Metal Tracking
  static addMetalTracking(metal: Omit<MetalTracking, 'id' | 'createdAt' | 'updatedAt'>) {
    const metalRef = ref(database, 'metalTracking');
    const newMetalRef = push(metalRef);
    const metalData = {
      ...metal,
      id: newMetalRef.key,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      testEndDate: metal.testEndDate.toISOString(),
    };
    return set(newMetalRef, metalData);
  }

  static updateMetalTracking(id: string, updates: Partial<MetalTracking>) {
    const metalRef = ref(database, `metalTracking/${id}`);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
      ...(updates.testEndDate && { testEndDate: updates.testEndDate.toISOString() }),
    };
    return update(metalRef, updateData);
  }

  static deleteMetalTracking(id: string) {
    const metalRef = ref(database, `metalTracking/${id}`);
    return remove(metalRef);
  }

  static subscribeToMetalTracking(callback: (metals: MetalTracking[]) => void) {
    const metalRef = ref(database, 'metalTracking');
    const unsubscribe = onValue(metalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const metals = Object.values(data).map((metal: any) => ({
          ...metal,
          testEndDate: new Date(metal.testEndDate),
          createdAt: new Date(metal.createdAt),
          updatedAt: new Date(metal.updatedAt),
        }));
        callback(metals);
      } else {
        callback([]);
      }
    });
    return () => off(metalRef, 'value', unsubscribe);
  }

  // Work Closures
  static addWorkClosure(work: Omit<WorkClosure, 'id' | 'createdAt' | 'updatedAt'>) {
    const workRef = ref(database, 'workClosures');
    const newWorkRef = push(workRef);
    const workData = {
      ...work,
      id: newWorkRef.key,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      startDate: work.startDate.toISOString(),
      endDate: work.endDate.toISOString(),
    };
    return set(newWorkRef, workData);
  }

  static updateWorkClosure(id: string, updates: Partial<WorkClosure>) {
    const workRef = ref(database, `workClosures/${id}`);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
      ...(updates.startDate && { startDate: updates.startDate.toISOString() }),
      ...(updates.endDate && { endDate: updates.endDate.toISOString() }),
    };
    return update(workRef, updateData);
  }

  static deleteWorkClosure(id: string) {
    const workRef = ref(database, `workClosures/${id}`);
    return remove(workRef);
  }

  static subscribeToWorkClosures(callback: (works: WorkClosure[]) => void) {
    const workRef = ref(database, 'workClosures');
    const unsubscribe = onValue(workRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const works = Object.values(data).map((work: any) => ({
          ...work,
          startDate: new Date(work.startDate),
          endDate: new Date(work.endDate),
          createdAt: new Date(work.createdAt),
          updatedAt: new Date(work.updatedAt),
        }));
        callback(works);
      } else {
        callback([]);
      }
    });
    return () => off(workRef, 'value', unsubscribe);
  }

  // Document Tracking
  static addDocumentTracking(document: Omit<DocumentTracking, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = ref(database, 'documentTracking');
    const newDocRef = push(docRef);
    const docData = {
      ...document,
      id: newDocRef.key,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return set(newDocRef, docData);
  }

  static updateDocumentTracking(id: string, updates: Partial<DocumentTracking>) {
    const docRef = ref(database, `documentTracking/${id}`);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    return update(docRef, updateData);
  }

  static deleteDocumentTracking(id: string) {
    const docRef = ref(database, `documentTracking/${id}`);
    return remove(docRef);
  }

  static subscribeToDocumentTracking(callback: (documents: DocumentTracking[]) => void) {
    const docRef = ref(database, 'documentTracking');
    const unsubscribe = onValue(docRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const documents = Object.values(data).map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
        }));
        callback(documents);
      } else {
        callback([]);
      }
    });
    return () => off(docRef, 'value', unsubscribe);
  }
}

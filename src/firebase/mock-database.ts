import { Task, MetalTracking, WorkClosure, DocumentTracking } from '../types';

// API service for shared data across all users
export class MockFirebaseService {
  private static readonly API_BASE = '/api/data';
  
  // Global polling interval
  private static globalPollInterval: NodeJS.Timeout | null = null;
  private static isPolling = false;

  private static async apiCall(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      if (response.status === 204) {
        return null; // No content for DELETE operations
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }

  // Global polling management
  private static startGlobalPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.globalPollInterval = setInterval(() => {
      this.pollAllData();
    }, 3000);
  }

  private static checkAndStopPolling() {
    const hasSubscribers = 
      this.taskSubscribers.length > 0 ||
      this.metalSubscribers.length > 0 ||
      this.workSubscribers.length > 0 ||
      this.documentSubscribers.length > 0;

    if (!hasSubscribers && this.isPolling) {
      if (this.globalPollInterval) {
        clearInterval(this.globalPollInterval);
        this.globalPollInterval = null;
      }
      this.isPolling = false;
    }
  }

  private static async pollAllData() {
    try {
      // Poll tasks
      if (this.taskSubscribers.length > 0) {
        const tasks = await this.loadTasks();
        this.taskSubscribers.forEach(callback => callback(tasks));
      }

      // Poll metal tracking
      if (this.metalSubscribers.length > 0) {
        const metals = await this.loadMetalTracking();
        this.metalSubscribers.forEach(callback => callback(metals));
      }

      // Poll work closures
      if (this.workSubscribers.length > 0) {
        const works = await this.loadWorkClosures();
        this.workSubscribers.forEach(callback => callback(works));
      }

      // Poll document tracking
      if (this.documentSubscribers.length > 0) {
        const documents = await this.loadDocumentTracking();
        this.documentSubscribers.forEach(callback => callback(documents));
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }

  // Tasks
  static async addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await this.apiCall('?type=tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
        return result;
  }

  static async updateTask(id: string, updates: Partial<Task>) {
    const result = await this.apiCall(`?type=tasks&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
        return result;
  }

  static async deleteTask(id: string) {
    const result = await this.apiCall(`?type=tasks&id=${id}`, {
      method: 'DELETE',
    });
        return result;
  }

  private static taskSubscribers: ((tasks: Task[]) => void)[] = [];

  static subscribeToTasks(callback: (tasks: Task[]) => void) {
    this.taskSubscribers.push(callback);
    
    // Load initial data
    this.loadTasks().then(callback).catch(console.error);
    
    // Start global polling if not already running
    this.startGlobalPolling();
    
    return () => {
      const index = this.taskSubscribers.indexOf(callback);
      if (index > -1) {
        this.taskSubscribers.splice(index, 1);
      }
      // Stop polling if no more subscribers
      this.checkAndStopPolling();
    };
  }

  private static async loadTasks(): Promise<Task[]> {
    try {
      const tasks = await this.apiCall('?type=tasks');
      return (tasks || []).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  private static async notifyTaskSubscribers() {
    try {
      const tasks = await this.loadTasks();
      this.taskSubscribers.forEach(callback => callback(tasks));
    } catch (error) {
      console.error('Failed to notify task subscribers:', error);
    }
  }

  // Metal Tracking
  static async addMetalTracking(metal: Omit<MetalTracking, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await this.apiCall('?type=metalTracking', {
      method: 'POST',
      body: JSON.stringify(metal),
    });
        return result;
  }

  static async updateMetalTracking(id: string, updates: Partial<MetalTracking>) {
    const result = await this.apiCall(`?type=metalTracking&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
        return result;
  }

  static async deleteMetalTracking(id: string) {
    const result = await this.apiCall(`?type=metalTracking&id=${id}`, {
      method: 'DELETE',
    });
        return result;
  }

  private static metalSubscribers: ((metals: MetalTracking[]) => void)[] = [];

  static subscribeToMetalTracking(callback: (metals: MetalTracking[]) => void) {
    this.metalSubscribers.push(callback);
    
    this.loadMetalTracking().then(callback).catch(console.error);
    
    // Start global polling if not already running
    this.startGlobalPolling();
    
    return () => {
      const index = this.metalSubscribers.indexOf(callback);
      if (index > -1) {
        this.metalSubscribers.splice(index, 1);
      }
      // Stop polling if no more subscribers
      this.checkAndStopPolling();
    };
  }

  private static async loadMetalTracking(): Promise<MetalTracking[]> {
    try {
      const metals = await this.apiCall('?type=metalTracking');
      return (metals || []).map((metal: any) => ({
        ...metal,
        testEndDate: new Date(metal.testEndDate),
        createdAt: new Date(metal.createdAt),
        updatedAt: new Date(metal.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  private static async notifyMetalSubscribers() {
    try {
      const metals = await this.loadMetalTracking();
      this.metalSubscribers.forEach(callback => callback(metals));
    } catch (error) {
      console.error('Failed to notify metal subscribers:', error);
    }
  }

  // Work Closures
  static async addWorkClosure(work: Omit<WorkClosure, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await this.apiCall('?type=workClosures', {
      method: 'POST',
      body: JSON.stringify(work),
    });
        return result;
  }

  static async updateWorkClosure(id: string, updates: Partial<WorkClosure>) {
    const result = await this.apiCall(`?type=workClosures&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
        return result;
  }

  static async deleteWorkClosure(id: string) {
    const result = await this.apiCall(`?type=workClosures&id=${id}`, {
      method: 'DELETE',
    });
        return result;
  }

  private static workSubscribers: ((works: WorkClosure[]) => void)[] = [];

  static subscribeToWorkClosures(callback: (works: WorkClosure[]) => void) {
    this.workSubscribers.push(callback);
    
    this.loadWorkClosures().then(callback).catch(console.error);
    
    // Start global polling if not already running
    this.startGlobalPolling();
    
    return () => {
      const index = this.workSubscribers.indexOf(callback);
      if (index > -1) {
        this.workSubscribers.splice(index, 1);
      }
      // Stop polling if no more subscribers
      this.checkAndStopPolling();
    };
  }

  private static async loadWorkClosures(): Promise<WorkClosure[]> {
    try {
      const works = await this.apiCall('?type=workClosures');
      return (works || []).map((work: any) => ({
        ...work,
        startDate: new Date(work.startDate),
        endDate: new Date(work.endDate),
        createdAt: new Date(work.createdAt),
        updatedAt: new Date(work.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  private static async notifyWorkSubscribers() {
    try {
      const works = await this.loadWorkClosures();
      this.workSubscribers.forEach(callback => callback(works));
    } catch (error) {
      console.error('Failed to notify work subscribers:', error);
    }
  }

  // Document Tracking
  static async addDocumentTracking(document: Omit<DocumentTracking, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await this.apiCall('?type=documentTracking', {
      method: 'POST',
      body: JSON.stringify(document),
    });
        return result;
  }

  static async updateDocumentTracking(id: string, updates: Partial<DocumentTracking>) {
    const result = await this.apiCall(`?type=documentTracking&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
        return result;
  }

  static async deleteDocumentTracking(id: string) {
    const result = await this.apiCall(`?type=documentTracking&id=${id}`, {
      method: 'DELETE',
    });
        return result;
  }

  private static documentSubscribers: ((documents: DocumentTracking[]) => void)[] = [];

  static subscribeToDocumentTracking(callback: (documents: DocumentTracking[]) => void) {
    this.documentSubscribers.push(callback);
    
    this.loadDocumentTracking().then(callback).catch(console.error);
    
    // Start global polling if not already running
    this.startGlobalPolling();
    
    return () => {
      const index = this.documentSubscribers.indexOf(callback);
      if (index > -1) {
        this.documentSubscribers.splice(index, 1);
      }
      // Stop polling if no more subscribers
      this.checkAndStopPolling();
    };
  }

  private static async loadDocumentTracking(): Promise<DocumentTracking[]> {
    try {
      const documents = await this.apiCall('?type=documentTracking');
      return (documents || []).map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  private static async notifyDocumentSubscribers() {
    try {
      const documents = await this.loadDocumentTracking();
      this.documentSubscribers.forEach(callback => callback(documents));
    } catch (error) {
      console.error('Failed to notify document subscribers:', error);
    }
  }
}

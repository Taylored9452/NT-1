
import { CustomerConfig, UserRole } from '../types';

const DB_NAME = 'ISP_SYSTEM_DB';
const DB_VERSION = 1;
const STORE_NAME = 'customers_store';
const SESSION_STORE = 'session_store';

/**
 * ระบบจัดการฐานข้อมูล IndexedDB (Browser Native DB)
 */
class PersistentDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
        if (!db.objectStoreNames.contains(SESSION_STORE)) {
          db.createObjectStore(SESSION_STORE);
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (e) => reject(e);
    });
  }

  async setCustomers(customers: CustomerConfig[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(customers, 'master_list');
      
      request.onsuccess = () => {
        console.log(`[IndexedDB] Persisted ${customers.length} records.`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getCustomers(): Promise<CustomerConfig[] | null> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('master_list');
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async setSession(role: UserRole, username: string): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction([SESSION_STORE], 'readwrite');
    transaction.objectStore(SESSION_STORE).put({ role, username }, 'current_session');
  }

  async getSession(): Promise<{ role: UserRole; username: string } | null> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction([SESSION_STORE], 'readonly');
      const request = transaction.objectStore(SESSION_STORE).get('current_session');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction([STORE_NAME, SESSION_STORE], 'readwrite');
    transaction.objectStore(STORE_NAME).clear();
    transaction.objectStore(SESSION_STORE).clear();
    return new Promise((resolve) => {
      transaction.oncomplete = () => {
        window.location.reload();
        resolve();
      };
    });
  }
}

export const db = new PersistentDB();

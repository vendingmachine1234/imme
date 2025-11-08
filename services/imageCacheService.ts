
const DB_NAME = 'AbacaFiberScannerDB';
const DB_VERSION = 1;
const STORE_NAME = 'fiberImages';

let db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const target = event.target as IDBOpenDBRequest;
      const database = target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      const target = event.target as IDBOpenDBRequest;
      db = target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
      reject("IndexedDB error");
    };
  });
}

export async function storeImage(key: string, base64Data: string): Promise<void> {
  try {
    const database = await openDB();
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await new Promise<void>((resolve, reject) => {
      const request = store.put({ key, data: base64Data });
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error("Error storing image:", (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  } catch (error) {
    console.error("Failed to store image in IndexedDB:", error);
  }
}

export async function getImage(key: string): Promise<string | null> {
  try {
    const database = await openDB();
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    return await new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result ? request.result.data : null);
      };
      request.onerror = (event) => {
        console.error("Error getting image:", (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  } catch (error) {
    console.warn("Failed to retrieve image from IndexedDB, proceeding without cache:", error);
    return null;
  }
}

export async function deleteImage(key: string): Promise<void> {
  try {
    const database = await openDB();
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = (event) => {
        console.error("Error deleting image:", (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  } catch (error) {
    console.error("Failed to delete image from IndexedDB:", error);
  }
}

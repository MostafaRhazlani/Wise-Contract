export function openDB(dbName = 'WiseContractDB', storeName = 'editorContent') {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setContent(key: string, value: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('editorContent', 'readwrite');
    const store = tx.objectStore('editorContent');

    try {
      const safeValue = JSON.parse(JSON.stringify(value));
      store.put(safeValue, key);
    } catch (error) {
      console.error("store data in indexedDB failed", error);
      reject(error);
      return;
    }
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getContent(key: string) {
  const db = await openDB();
  return new Promise<any>((resolve, reject) => {
    const tx = db.transaction('editorContent', 'readonly');
    const store = tx.objectStore('editorContent');
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function removeContent(key: string) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction('editorContent', 'readwrite');
    const store = tx.objectStore('editorContent');
    store.delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
} 
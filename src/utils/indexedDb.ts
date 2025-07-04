// src/utils/indexedDb.ts

const DB_NAME = 'MiraclesDB';
const DB_VERSION = 1;
const STORE_NAME = 'appObjects'; // A generic store for various application objects

let db: IDBDatabase | null = null;

/**
 * Opens the IndexedDB database.
 * If the database doesn't exist, or if the version is new, it creates/updates object stores.
 * @returns A Promise that resolves with the IDBDatabase instance.
 */
export function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db); // Return existing connection if already open
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                // We'll use 'id' as the keyPath. If your objects don't have an 'id',
                // you can remove keyPath and let IndexedDB generate keys, or use autoIncrement.
                // For generic objects, having an 'id' property is often convenient.
                database.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            // Handle unexpected database close (e.g., by user in dev tools)
            db.onversionchange = () => {
                db?.close();
                db = null;
                console.warn('IndexedDB database connection closed due to version change. Please reload.');
            };
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
            reject('Failed to open IndexedDB: ' + (event.target as IDBOpenDBRequest).error?.message);
        };
    });
}

/**
 * Puts (adds or updates) an object in the specified object store.
 * @param object The object to store. It must have an 'id' property if keyPath is set.
 * @param storeName The name of the object store (defaults to 'appObjects').
 * @returns A Promise that resolves when the operation is complete.
 */
export async function putObject<T extends { id: IDBValidKey }>(
    object: T,
    storeName: string = STORE_NAME
): Promise<void> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(object); // 'put' adds or updates based on the key

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error putting object:', (event.target as IDBRequest).error);
            reject('Failed to put object');
        };

        // No need to close db here; connection can remain open for subsequent operations
    });
}

/**
 * Retrieves an object from the specified object store by its key.
 * @param id The ID (key) of the object to retrieve.
 * @param storeName The name of the object store (defaults to 'appObjects').
 * @returns A Promise that resolves with the retrieved object, or undefined if not found.
 */
export async function getObject<T>(
    id: IDBValidKey,
    storeName: string = STORE_NAME
): Promise<T | undefined> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result as T | undefined);
        };

        request.onerror = (event) => {
            console.error('Error getting object:', (event.target as IDBRequest).error);
            reject('Failed to get object');
        };

        // No need to close db here; connection can remain open for subsequent operations
    });
}

/**
 * Clears all objects from the specified object store.
 * @param storeName The name of the object store to clear (defaults to 'appObjects').
 * @returns A Promise that resolves when the store is cleared.
 */
export async function clearStore(storeName: string = STORE_NAME): Promise<void> {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error clearing store:', (event.target as IDBRequest).error);
            reject('Failed to clear store');
        };
    });
}

/**
 * Closes the IndexedDB database connection.
 * Call this when your application is shutting down or no longer needs database access.
 */
export function closeDatabase() {
    if (db) {
        db.close();
        db = null;
        console.log('IndexedDB connection closed.');
    }
}

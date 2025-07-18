const DB_NAME = 'MiraclesDB';
const DB_VERSION = 1;
const STORE_NAMES = ["rooms", "characters", "items", "turns"]; // A generic store for various application objects

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
            STORE_NAMES.forEach(storeName => {
                if (!database.objectStoreNames.contains(storeName)) {
                    database.createObjectStore(storeName, { keyPath: 'id' });
                }
            })
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
    storeName: string,
    object: T
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
    storeName: string,
    id: IDBValidKey
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
 * Deletes the entire database to ensure a clean state.
 * This is the most effective way to "clear everything", as it forces a 
 * recreation with the latest schema on the next page load.
 * @returns A Promise that resolves when the database is successfully deleted.
 */
export function clearStore(): Promise<void> {
    return new Promise((resolve, reject) => {
        // Ensure any existing connection is closed before trying to delete.
        if (db) {
            db.close();
            db = null;
        }

        console.log(`Attempting to delete database: ${DB_NAME}`);
        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

        deleteRequest.onsuccess = () => {
            console.log(`Database ${DB_NAME} deleted successfully. Please reload the page.`);
            resolve();
        };

        deleteRequest.onerror = (event) => {
            console.error('Error deleting database:', (event.target as IDBRequest).error);
            reject('Failed to delete database');
        };

        // This event is fired if the database is open in another tab, preventing deletion.
        deleteRequest.onblocked = () => {
            console.warn('Database deletion is blocked. Please close other tabs with this app open.');
            reject('Database deletion blocked');
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

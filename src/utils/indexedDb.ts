const DB_NAME = 'MiraclesDB';
const DB_VERSION = 1;
const STORE_NAMES = ["maps", "rooms", "characters", "items", "turns"];

let dbPromise: Promise<IDBDatabase> | null = null;

async function openDatabase(): Promise<IDBDatabase> {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const database = (event.target as IDBOpenDBRequest).result;
            STORE_NAMES.forEach(storeName => {
                if (!database.objectStoreNames.contains(storeName)) {
                    database.createObjectStore(storeName, { keyPath: 'id' });
                }
            });
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            db.onversionchange = () => {
                db.close();
                dbPromise = null;
                console.warn('IndexedDB database connection closed due to version change. Please reload.');
            };
            resolve(db);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
            dbPromise = null;
            reject('Failed to open IndexedDB: ' + (event.target as IDBOpenDBRequest).error?.message);
        };
    });

    return dbPromise;
}

export async function putObject<T extends { id: IDBValidKey }>(
    storeName: string,
    object: T
): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(object);

        request.onsuccess = () => resolve();
        request.onerror = (event) => {
            console.error('Error putting object:', (event.target as IDBRequest).error);
            reject('Failed to put object');
        };
    });
}

export async function getObject<T>(
    storeName: string,
    id: IDBValidKey
): Promise<T | undefined> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = (event) => {
            resolve((event.target as IDBRequest).result as T | undefined);
        };
        request.onerror = (event) => {
            console.error('Error getting object:', (event.target as IDBRequest).error);
            reject('Failed to get object');
        };
    });
}

export async function getAllObjectsFromStore<T>(
    storeName: string,
    filter?: (obj: T) => boolean
): Promise<T[]> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.openCursor();
        const results: T[] = [];

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                const obj = cursor.value as T;
                if (filter) {
                    if (filter(obj)) {
                        results.push(obj);
                    }
                } else {
                    results.push(obj);
                }
                cursor.continue();
            } else {
                resolve(results);
            }
        };

        request.onerror = (event) => {
            console.error('Error getting all objects:', (event.target as IDBRequest).error);
            reject('Failed to get all objects');
        };
    });
}

export async function clearStore(): Promise<void> {
    await closeDatabase();
    return new Promise((resolve, reject) => {
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

        deleteRequest.onblocked = () => {
            console.warn('Database deletion is blocked. Please close other tabs with this app open.');
            reject('Database deletion blocked');
        };
    });
}

export async function closeDatabase(): Promise<void> {
    if (dbPromise) {
        const db = await dbPromise;
        db.close();
        dbPromise = null;
        console.log('IndexedDB connection closed.');
    }
}

let db = null;

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("NutritionDB", 1);

        request.onerror = (event) => {
            console.error("Database error:", event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("Database opened successfully");
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            const store = db.createObjectStore("patients", { autoIncrement: true });
            store.createIndex("patientID", "patientID");
            store.createIndex("day", "day");
            store.createIndex("patientID_day", ["patientID", "day"], { unique: true });
        };
    });
}

export function savePatientData(patientID, day, data) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error("Database not initialized"));
            return;
        }

        const transaction = db.transaction(["patients"], "readwrite");
        const store = transaction.objectStore("patients");
        const index = store.index("patientID_day");
        const query = index.getKey([patientID, day]);

        query.onsuccess = (event) => {
            const existingKey = event.target.result;
            if (existingKey !== undefined) {
                const updatedRecord = { patientID, day, data };
                const updateRequest = store.put(updatedRecord, existingKey);
                updateRequest.onsuccess = () => resolve({ updated: true });
                updateRequest.onerror = () => reject(updateRequest.error);
            } else {
                const addRequest = store.add({ patientID, day, data });
                addRequest.onsuccess = () => resolve({ updated: false });
                addRequest.onerror = () => reject(addRequest.error);
            }
        };

        query.onerror = () => reject(query.error);
    });
}

export function getAllPatients() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error("Database not initialized"));
            return;
        }

        const transaction = db.transaction(["patients"], "readonly");
        const store = transaction.objectStore("patients");
        const request = store.getAll();

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = () => reject(request.error);
    });
}

export function getPatientHistory(patientID) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error("Database not initialized"));
            return;
        }

        const transaction = db.transaction(["patients"], "readonly");
        const store = transaction.objectStore("patients");
        const index = store.index("patientID");
        const request = index.getAll(patientID);

        request.onsuccess = (event) => {
            const records = event.target.result.sort((a, b) => a.day - b.day);
            resolve(records);
        };

        request.onerror = () => reject(request.error);
    });
}

export function getPatientDay(patientID, day) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error("Database not initialized"));
            return;
        }

        const transaction = db.transaction(["patients"], "readonly");
        const store = transaction.objectStore("patients");
        const index = store.index("patientID_day");
        const request = index.get([patientID, day]);

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = () => reject(request.error);
    });
}

export function deletePatient(patientID) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error("Database not initialized"));
            return;
        }

        const transaction = db.transaction(["patients"], "readwrite");
        const store = transaction.objectStore("patients");
        const index = store.index("patientID");
        const request = index.openCursor(patientID);

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            } else {
                resolve();
            }
        };

        request.onerror = () => reject(request.error);
    });
}

export function deletePatientDay(patientID, day) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error("Database not initialized"));
            return;
        }

        const transaction = db.transaction(["patients"], "readwrite");
        const store = transaction.objectStore("patients");
        const index = store.index("patientID_day");
        const request = index.getKey([patientID, day]);

        request.onsuccess = (event) => {
            const key = event.target.result;
            if (key) {
                const deleteRequest = store.delete(key);
                deleteRequest.onsuccess = () => resolve();
                deleteRequest.onerror = () => reject(deleteRequest.error);
            } else {
                resolve();
            }
        };

        request.onerror = () => reject(request.error);
    });
}

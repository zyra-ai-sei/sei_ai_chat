import { FixTypeLater } from '../interface/common.interface';

/* eslint-disable no-unused-vars */
// const countCacheSize = () => {
//     let obj = window.localStorage as FixTypeLater;
//     if (obj) {
//         let size = 0;
//         for (let item in obj) {
//             if (obj.hasOwnProperty(item)) {
//                 size += obj.getItem(item).length;
//             }
//         }
//         console.log(`total used cache size => ${(size / 1024).toFixed(2)} KB.`);
//     }
// };

export function getLocalStorage(key: FixTypeLater) {
    if (window.localStorage) {
        let storage = window.localStorage;
        let value = storage.getItem(key);
        if (!value) {
            return '';
        }
        try {
            let now = new Date();
            let obj = JSON.parse(storage.getItem(key) as FixTypeLater);
            if (obj.expiry) {
                // If the obj is expired, delete the item from storage
                // and return null
                if (now.getTime() > obj.expiry) {
                    localStorage.removeItem(key);
                    return '';
                }
                return obj.data;
            }
            return obj;
        } catch (e) {
            console.error(e);
            storage.removeItem(key);
        }
    }
    return '';
}

export async function saveToLocalStorage(key: FixTypeLater, value: FixTypeLater, ttl = 0) {
    if (window.localStorage) {
        let storage = window.localStorage;
        let now = new Date();
        let data = ttl > 0 ? { data: value, expiry: now.getTime() + ttl } : value;
        storage.setItem(key, JSON.stringify(data));

        // countCacheSize();
    }
}

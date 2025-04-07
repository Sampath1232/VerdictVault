import CryptoJS from 'crypto-js';

export function generateHash(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
            const hash = CryptoJS.SHA256(wordArray).toString();
            resolve(hash);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
}

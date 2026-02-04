
# 🧾 Verdict Vault

A secure document storage and retrieval DApp built with React and IPFS. Verdict Vault allows you to **encrypt**, **upload**, **preview**, **download**, and **share** files using **QR codes** and **secret keys** — ensuring privacy and security.

---

## ✨ Features

- **AES Encryption** with custom secret key  
- **IPFS Upload** using `ipfs-http-client`  
- **Secure File Sharing** via QR Code  
- **Decryption via Key** (Only with correct key)  
- **Multi-format Support** (PDF, TXT, DOCX, JPEG, PNG, etc.)  
- **Real-time Previews** (Post decryption)  
- **QR-Accessible Decryption Page**  
- **Mobile Compatible** (Scan QR and decrypt)

---

## 📁 Project Structure

```
verdict-vault-frontend/
│
├── public/
│   └── index.html
│
├── src/
│   ├── assets/                  # Static files (if any)
│   ├── components/
│   │   └── VerdictUpload.js     # Upload, encryption, QR generation
│   ├── pages/
│   │   └── DecryptPage.js       # Decryption, preview, and download
│   ├── utils/
│   │   └── ipfs.js              # IPFS upload logic
│   ├── App.js                   # Routes
│   ├── index.js                 # React DOM entry
│   └── styles.css               # Optional global styles
├── .env                         # Optional configs (e.g. IPFS base URL)
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack

- React  
- JavaScript (ES6+)  
- IPFS (via `ipfs-http-client`)  
- AES Encryption (`crypto-js` or WebCrypto API)  
- `qrcode.react` for QR code  
- `react-router-dom` for routing  
- Bootstrap + Animate.css for UI

---

## 🚀 How to Run

> Ensure **Node.js** and **npm** are installed.

1. **Clone the repository**
   ```bash
   git clone https://github.com/sampath1232/verdict-vault.git
   cd verdict-vault-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. Open the app:
   ```
   http://localhost:3000
   ```

---

## 🔐 Implementation Flow

### 1. Encrypt & Upload
- File is read as `ArrayBuffer` and converted to `base64`
- Encrypted using **AES** with a user-defined password
- Result is uploaded to **IPFS** via `ipfs-http-client`
- CID + filename encoded in a **QR Code**

### 2. Decrypt & Download
- User scans QR or opens decrypt link
- Enters same **secret key** used for encryption
- Encrypted file is fetched from IPFS
- AES Decryption is applied
- File is reconstructed and downloaded
- Preview is shown for supported formats

---

## 📲 Mobile Support

- Ensure your **PC and mobile** are connected to the **same Wi-Fi**
- Use your local IP (e.g., `192.168.x.x`) instead of `localhost` when generating QR codes:
  ```
  http://192.168.x.x:3000/decrypt?cid=...&fileName=...
  ```

---

## 🛠 Dependencies Used

```bash
npm install react-router-dom crypto-js qrcode.react bootstrap animate.css ipfs-http-client
```

---

## ✅ Supported File Types

- `.txt`, `.pdf`  
- `.jpeg`, `.jpg`, `.png`  
- `.doc`, `.docx` *(downloadable, not previewed)*

---

## ❗ Notes

- IPFS uploads are public — encryption is **mandatory**
- Keep your **secret key** safe — it's the only way to decrypt
- Previews depend on browser support and file format

---
## 🚀 Projects
- **VerdictVault** – Blockchain-based secure legal document management using IPFS, encryption, and smart contracts  
  👉 https://github.com/your-username/VerdictVault

---

## 📧 Contact

**Developer:** Sampath Shankar  
**GitHub:** [sampath1232](https://github.com/sampath1232)  
**Email:** lokamanyasampath@gmail.com

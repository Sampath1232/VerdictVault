# 🧾 VerdictVault

> A Blockchain-Based Forensic Evidence & Legal Document Verification System

VerdictVault is a secure decentralized platform designed for storing, verifying, and protecting legal documents and digital evidence using blockchain technology, AES encryption, IPFS decentralized storage, and SHA-256 forensic hashing.

The system provides tamper detection, blockchain-backed integrity verification, decentralized encrypted storage, and chain-of-custody tracking.

---

# 🚀 Version

## Current Release
`VerdictVault v2.0`

---

# 📌 Table of Contents

- Overview
- Features
- Screenshots
- System Architecture
- Tech Stack
- Installation
- Smart Contract Deployment
- Frontend Setup
- IPFS Setup
- MetaMask Setup
- Tamper Detection
- Chain of Custody
- Project Structure
- v1.0 Changelog
- v2.0 Changelog
- Future Scope
- License

---

# 📖 Overview

VerdictVault provides:

- 🔐 AES encrypted evidence storage
- 🌐 Decentralized IPFS storage
- ⛓ Blockchain metadata verification
- 🛡 SHA-256 forensic integrity validation
- ❌ Tamper detection
- 📜 Chain-of-custody tracking
- 🦊 MetaMask blockchain authentication
- 📱 QR-based file retrieval

The project combines:

- Cybersecurity
- Blockchain
- Cryptography
- Digital Forensics
- Decentralized Storage

into a unified forensic evidence verification platform.

---

# ✨ Features

## 🔐 AES Encryption
Files are encrypted locally before upload using AES encryption with a user-defined secret key.

---

## 🌐 IPFS Decentralized Storage
Encrypted evidence files are uploaded to IPFS using Pinata integration.

---

## ⛓ Blockchain Evidence Tracking
Blockchain stores:

- Case ID
- IPFS Hash
- SHA-256 Document Hash
- Metadata
- Timestamp
- Uploader Wallet Address
- Verification Status

---

## 🛡 Tamper Detection
Compares SHA-256 hash of uploaded evidence with blockchain-stored hash.

### Results

```text
✅ VERIFIED
```

or

```text
❌ TAMPERED
```

---

## 📜 Chain of Custody
Tracks:
- Upload events
- Verification events
- Revocation logs
- Wallet addresses
- Timestamps

---

## 📱 QR Code Sharing
Automatically generates QR code for evidence retrieval.

---

## 🦊 MetaMask Integration
Supports Ethereum wallet authentication and transaction signing.

---

# 📸 Screenshots

## 🖥 Upload Dashboard

<img width="540" height="750" alt="VerdictVaultDashboard" src="https://github.com/user-attachments/assets/a8c1ba2b-3c63-4fea-8be0-2c4dac9b9e3a" />

## ⛓ Blockchain Verification

<img width="1755" height="959" alt="BlockchainVerification" src="https://github.com/user-attachments/assets/f5ceefb9-8d29-42c4-9b55-541c9c070a56" />

## 🛡 Tamper Detection and Chain of Custody

<img width="891" height="567" alt="VerdictTamper CoC" src="https://github.com/user-attachments/assets/9663c0a7-3465-4cda-8a1a-fefd7c819cb7" />

## 📱 Verdict Upload Metadata

<img width="901" height="340" alt="VerdictUpload" src="https://github.com/user-attachments/assets/1f6c31e1-eaaf-4698-a4fe-fa310a221de8" />

## 📱 Verdict Verify by CaseID

<img width="896" height="753" alt="VerdictVerify" src="https://github.com/user-attachments/assets/ba97e2a3-3ec6-4c09-93c9-55ff29bb4329" />


## 📱 QR File Retrieval

<img width="932" height="467" alt="QRCodeRetrive" src="https://github.com/user-attachments/assets/053987da-3105-4baf-ac54-5ba6ad84007e" />


# 🏗 System Architecture

```text
User Upload
     ↓
AES Encryption
     ↓
SHA-256 Hash Generation
     ↓
Upload Encrypted File → IPFS
     ↓
Store Metadata + Hash → Blockchain
     ↓
Verification & Tamper Detection
```

---

# ⚙️ Tech Stack

## Frontend
- React.js
- Bootstrap 5
- Animate.css
- QRCode.react

## Blockchain
- Solidity
- Truffle
- Ganache
- Web3.js

## Security & Storage
- CryptoJS
- SHA-256
- IPFS
- Pinata

---

# 📂 Project Structure

```text
VerdictVault/
│
├── contracts/
│   └── VerdictVault.sol
│
├── migrations/
│   └── 2_deploy_contracts.js
│
├── build/
│
├── verdict-vault-frontend/
│   ├── src/
│   │   ├── abi/
│   │   ├── utils/
│   │   ├── components/
│   │   ├── App.js
│   │   └── VerdictUpload.js
│   │
│   └── public/
│
├── screenshots/
│
└── truffle-config.js
```

---

# 🛠 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/VerdictVault.git
cd VerdictVault
```

---

## 2️⃣ Install Backend Dependencies

```bash
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd verdict-vault-frontend

npm install
```

---

## 4️⃣ Start Ganache

Run Ganache locally:

```text
127.0.0.1:7545
```

---

## 5️⃣ Compile Smart Contract

```bash
npx truffle compile
```

---

## 6️⃣ Deploy Smart Contract

```bash
npx truffle migrate --reset
```

---

## 7️⃣ Update ABI

Copy:

```text
build/contracts/VerdictVault.json
```

To:

```text
verdict-vault-frontend/src/abi/
```

---

## 8️⃣ Update Contract Address

Inside:

```text
src/utils/contract.js
```

Replace:

```javascript
const contractAddress = "YOUR_DEPLOYED_ADDRESS";
```

---

## 9️⃣ Start Frontend

```bash
cd verdict-vault-frontend

npm start
```

---

# 🔑 Pinata Setup

Create free account:

https://www.pinata.cloud/

Generate:
- API Key
- Secret API Key

Update:

```text
src/utils/ipfs.js
```

---

# 🦊 MetaMask Setup

## Add Ganache Network

```text
Network Name: Ganache Local
RPC URL: http://127.0.0.1:7545
Chain ID: 5777
Currency Symbol: ETH
```

---

## Import Ganache Account

Copy private key from Ganache and import into MetaMask.

---

# 🛡 Tamper Detection Workflow

## Upload Phase

1. File converted to Base64
2. SHA-256 hash generated
3. AES encryption applied
4. Encrypted file uploaded to IPFS
5. Blockchain stores metadata + forensic hash

---

## Verification Phase

1. User selects local file
2. SHA-256 recalculated
3. Compared with blockchain hash

### Output

```text
✅ VERIFIED
```

or

```text
❌ TAMPERED
```

---

# 📜 Chain of Custody

Stores forensic audit logs:

- Upload
- Verification
- Revocation
- Timestamp
- Wallet Address

---

# 🔄 Version History

# 🟢 VerdictVault v1.0

## Features
- Basic IPFS file upload
- AES file encryption
- Blockchain metadata storage
- QR code generation
- MetaMask integration
- File decryption & download

---

# 🔵 VerdictVault v2.0

## Major Enhancements
- SHA-256 forensic hashing
- Tamper detection system
- Blockchain integrity verification
- Case ID verification
- Enhanced metadata tracking
- Access logs & chain-of-custody
- Improved frontend UI
- Transaction tracking
- Forensic verification workflow
- Improved smart contract architecture

---

# 🧪 Test Cases

## ✅ Upload & Verify
- Upload evidence
- Verify by Case ID
- Retrieve blockchain metadata

---

## ✅ Integrity Validation
- Upload original file
- Verify same file
- Output:

```text
✅ VERIFIED
```

---

## ❌ Tampered Evidence Detection
- Modify uploaded file
- Run verification
- Output:

```text
❌ TAMPERED
```

---

# 🔮 Future Enhancements

- Hardhat migration
- MongoDB backend
- JWT authentication
- AI legal document analysis
- Evidence timeline visualization
- PDF preview system
- Multi-user authentication
- Sepolia deployment
- Role-based access control
- Analytics dashboard
- Cloud deployment

---

# 👨‍💻 Author

## Sampath G L

Cybersecurity & Blockchain Developer

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Acknowledgements

- Ethereum
- Solidity
- IPFS
- Pinata
- Truffle Suite
- Web3.js
- React.js
- CryptoJS
- Bootstrap

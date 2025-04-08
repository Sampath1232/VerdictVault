import React, { useState } from 'react';
import { uploadToIPFS } from '../utils/ipfs';
import { initContract } from '../utils/contract';
import CryptoJS from 'crypto-js';
import { QRCodeSVG } from 'qrcode.react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import './VerdictUpload.css';

const VerdictUpload = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState('');
  const [status, setStatus] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [downloadKey, setDownloadKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [caseID, setCaseID] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [txHash, setTxHash] = useState('');
  const [verificationResult, setVerificationResult] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !secretKey || !caseID || !title || !category) {
      setStatus('❗ All fields are required');
      return;
    }

    try {
      setStatus('🔐 Encrypting and uploading...');
      const reader = new FileReader();

      reader.onload = async (event) => {
        const wordArray = CryptoJS.lib.WordArray.create(event.target.result);
        const base64 = CryptoJS.enc.Base64.stringify(wordArray);
        const encrypted = CryptoJS.AES.encrypt(base64, secretKey).toString();
        const blob = new Blob([encrypted], { type: 'text/plain' });

        const encryptedCid = await uploadToIPFS(blob);
        setCid(encryptedCid);
        setFileName(file.name);

        setStatus('⛓️ Storing metadata on blockchain...');
        const { contractInstance, signerAddress } = await initContract();

        const tx = await contractInstance.methods
          .storeVerdict(caseID, encryptedCid)
          .send({ from: signerAddress });

        setTxHash(tx.transactionHash);
        setStatus('✅ File uploaded and stored successfully!');
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setStatus('❌ Upload or blockchain storage failed');
    }
  };

  const handleDownload = async () => {
    if (!downloadKey || !cid) {
      alert('Please enter the secret key to decrypt the file.');
      return;
    }

    setStatus('🔓 Fetching and decrypting...');

    try {
      const res = await fetch(`https://ipfs.io/ipfs/${cid}`);
      const encryptedText = await res.text();

      const decrypted = CryptoJS.AES.decrypt(encryptedText, downloadKey);
      const base64 = decrypted.toString(CryptoJS.enc.Utf8);

      if (!base64) {
        throw new Error('Decryption returned empty string');
      }

      const wordArray = CryptoJS.enc.Base64.parse(base64);
      const typedArray = Uint8Array.from({ length: wordArray.sigBytes }, (_, i) =>
        (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
      );

      const blob = new Blob([typedArray]);
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'decrypted_file';
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus('🔄 Finalizing download...');
      setTimeout(() => {
        setStatus('✅ File decrypted and downloaded!');
      }, 5000);
    } catch (err) {
      console.error('❌ Decryption failed:', err);
      setStatus('❌ Incorrect key or failed to decrypt.');
    }
  };

  const handleVerify = async () => {
    if (!caseID) {
      setVerificationResult('❗ Enter a Case ID');
      return;
    }

    try {
      const { contractInstance } = await initContract();
      const result = await contractInstance.methods.getVerdict(caseID).call();
      setVerificationResult(`✅ Found: IPFS Hash - ${result.ipfsHash}, Uploader: ${result.uploader}`);
    } catch (error) {
      setVerificationResult('❌ No verdict found or blockchain error');
    }
  };

  return (
    <div className="container animate__animated animate__fadeIn">
      <div className="card shadow-lg">
        <h2 className="text-center text-primary">🧾 Secure Verdict Vault</h2>

        <form onSubmit={handleUpload}>
          <div className="mb-3">
            <label className="form-label fw-bold">Case ID:</label>
            <input
              type="text"
              className="form-control"
              value={caseID}
              onChange={(e) => setCaseID(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Document Title:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category:</label>
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Choose File:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".jpeg,.jpg,.png,.txt,.doc,.docx,.pdf"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Enter Secret Key:</label>
            <input
              type="password"
              className="form-control"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            🔼 Encrypt & Upload
          </button>
        </form>

        <hr />

        <div className="mt-3">
          <label className="form-label fw-bold">Enter Secret Key to Decrypt:</label>
          <input
            type="password"
            className="form-control mb-2"
            value={downloadKey}
            onChange={(e) => setDownloadKey(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={handleDownload}>
            🔽 Download & Decrypt
          </button>
        </div>

        <hr />

        <div className="mt-3">
          <label className="form-label fw-bold">Verify by Case ID:</label>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Enter Case ID"
              value={caseID}
              onChange={(e) => setCaseID(e.target.value)}
            />
            <button className="btn btn-warning" onClick={handleVerify}>Verify</button>
          </div>
          {verificationResult && <div className="alert alert-info mt-2">{verificationResult}</div>}
        </div>

        {status && <div className="alert alert-success mt-3">{status}</div>}

        {txHash && (
          <div className="alert alert-success mt-2">
            ✅ TX Hash: <code>{txHash}</code>
          </div>
        )}

        {cid && (
          <div className="qr-container">
            <label className="form-label fw-bold mb-2">Scan QR code to download file:</label>
            <QRCodeSVG value={`http://192.168.1.122:3000/decrypt?cid=${cid}&fileName=${fileName}`} size={160} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VerdictUpload;

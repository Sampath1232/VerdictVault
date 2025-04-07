import React, { useState } from 'react';
import { uploadToIPFS } from '../utils/ipfs';
import CryptoJS from 'crypto-js';
import { QRCodeSVG } from 'qrcode.react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

const VerdictUpload = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState('');
  const [status, setStatus] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [downloadKey, setDownloadKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !secretKey) {
      setStatus('❗ Please select a file and enter a secret key');
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
        setStatus('✅ File encrypted and uploaded to IPFS');
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setStatus('❌ Upload failed');
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

  const renderPreview = () => {
    const ext = fileName.split('.').pop().toLowerCase();

    if (previewUrl && ext === 'pdf') {
      return <iframe src={previewUrl} width="100%" height="600px" title="PDF Preview" />;
    } else if (previewUrl && ['jpg', 'jpeg', 'png'].includes(ext)) {
      return <img src={previewUrl} alt="Preview" className="img-fluid" />;
    } else if (previewUrl && ext === 'txt') {
      return <iframe src={previewUrl} width="100%" height="300px" title="Text Preview" />;
    } else {
      return <p>No preview available for this file type.</p>;
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <div className="card shadow-lg p-4">
        <h2 className="text-center text-primary mb-3">🧾 Secure Verdict Vault</h2>

        <form onSubmit={handleUpload}>
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

        {status && <div className="alert alert-info mt-3">{status}</div>}

        {cid && (
          <div className="mt-3 text-center">
            <p><strong>IPFS CID:</strong> {cid}</p>
           <QRCodeSVG value={`http://192.168.1.122:3000/decrypt?cid=${cid}&fileName=${fileName}`} />

          </div>
        )}

        {previewUrl && (
          <div className="mt-4">
            <h5>📄 File Preview:</h5>
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerdictUpload;
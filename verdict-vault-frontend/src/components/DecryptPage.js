import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import 'bootstrap/dist/css/bootstrap.min.css';

const DecryptPage = () => {
  const [downloadKey, setDownloadKey] = useState('');
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');
  const [cid, setCid] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setCid(urlParams.get('cid'));
    setFileName(urlParams.get('fileName'));
  }, []);

  const handleDecrypt = async () => {
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

      setStatus('✅ File decrypted and downloaded!');
    } catch (err) {
      console.error('❌ Decryption failed:', err);
      setStatus('❌ Incorrect key or failed to decrypt.');
    }
  };

 
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow-lg p-4">
            <h2 className="text-center text-primary mb-3">🔓 Decrypt Your File</h2>
            <div className="mb-3">
              <label className="form-label fw-bold">Enter Secret Key to Decrypt:</label>
              <input
                type="password"
                className="form-control"
                value={downloadKey}
                onChange={(e) => setDownloadKey(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100" onClick={handleDecrypt}>
              🔽 Download & Decrypt
            </button>

            {status && <div className="alert alert-info mt-3">{status}</div>}

            {cid && (
              <div className="mt-3 text-center">
                <p><strong>IPFS CID:</strong> {cid}</p>
                <p><strong>File Name:</strong> {fileName}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DecryptPage;

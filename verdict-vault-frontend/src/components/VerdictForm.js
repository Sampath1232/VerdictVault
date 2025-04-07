import React, { useState } from 'react';
import { uploadToIPFS } from '../utils/ipfs';

const VerdictUpload = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState('');
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('❗ Please select a file');
      return;
    }

    console.log("Submitting file:", file); // 👈 Logs selected file to the console

    try {
      setStatus('⏳ Uploading...');
      const cid = await uploadToIPFS(file);
      setCid(cid);
      setStatus('✅ Uploaded!');
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('❌ Upload failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Verdict File to IPFS</h2>
      <form onSubmit={handleUpload}>
        <div>
          <label>Upload Verdict File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>

      {status && <p>{status}</p>}
      {cid && (
        <p>
          IPFS CID: <code>{cid}</code><br />
          Link: <a href={`http://127.0.0.1:8080/ipfs/${cid}`} target="_blank" rel="noreferrer">
            View File
          </a>
        </p>
      )}
    </div>
  );
};

export default VerdictUpload;

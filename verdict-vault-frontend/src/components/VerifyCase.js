import React, { useState } from 'react';
import { initContract } from '../utils/contract';

const VerifyCase = () => {
  const [caseID, setCaseID] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [status, setStatus] = useState('');

  const fetchVerdict = async () => {
    if (!caseID) {
      alert('Please enter Case ID');
      return;
    }

    try {
      setStatus('🔎 Fetching from blockchain...');
      const { contractInstance } = await initContract();
      const result = await contractInstance.methods.getVerdict(caseID).call();

      // Normalize result (web3 returns both indexed and numeric keys)
      const ipfsHash = result.ipfsHash ?? result[0];
      const title = result.title ?? result[1];
      const category = result.category ?? result[2];
      const timestamp = result.timestamp ?? result[3];
      const uploader = result.uploader ?? result[4];

      setVerdict({ ipfsHash, title, category, timestamp, uploader });
      setStatus('');
    } catch (err) {
      console.error('❌ fetchVerdict error:', err);
      setVerdict(null);
      setStatus('❌ No record found or error fetching verdict');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h3 className="text-center">🔍 Verify Case Verdict</h3>
        <input type="text" className="form-control mb-2" placeholder="Enter Case ID" value={caseID} onChange={(e) => setCaseID(e.target.value)} />
        <button className="btn btn-primary w-100 mb-3" onClick={fetchVerdict}>Check Verdict</button>

        {status && <div className="alert alert-info">{status}</div>}

        {verdict && (
          <div className="alert alert-success">
            📄 <b>Title:</b> {verdict.title} <br />
            🏷️ <b>Category:</b> {verdict.category} <br />
            ✅ <b>IPFS Hash:</b> <a href={`https://ipfs.io/ipfs/${verdict.ipfsHash}`} target="_blank" rel="noreferrer">{verdict.ipfsHash}</a> <br />
            ⏱️ <b>Timestamp:</b> {verdict.timestamp ? new Date(Number(verdict.timestamp) * 1000).toLocaleString() : '—'} <br />
            👤 <b>Uploader:</b> {verdict.uploader}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCase;

import React, { useState } from 'react';
import { initContract } from '../utils/contract';

const VerifyCase = () => {
  const [caseID, setCaseID] = useState('');
  const [verdict, setVerdict] = useState(null);

  const fetchVerdict = async () => {
    try {
      const { contractInstance } = await initContract();
      const result = await contractInstance.methods.getVerdict(caseID).call();
      setVerdict(result);
    } catch (err) {
      alert("❌ No record found or error fetching verdict");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h3 className="text-center">🔍 Verify Case Verdict</h3>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter Case ID"
          value={caseID}
          onChange={(e) => setCaseID(e.target.value)}
        />
        <button className="btn btn-primary w-100 mb-3" onClick={fetchVerdict}>Check Verdict</button>
        {verdict && (
          <div className="alert alert-success">
            ✅ IPFS Hash: {verdict.ipfsHash} <br />
            ⏱️ Timestamp: {new Date(verdict.timestamp * 1000).toLocaleString()} <br />
            👤 Uploader: {verdict.uploader}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCase;

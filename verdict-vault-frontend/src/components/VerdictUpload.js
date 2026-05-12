import React, { useState } from 'react';
import { uploadToIPFS } from '../utils/ipfs';
import { initContract } from '../utils/contract';
import CryptoJS from 'crypto-js';
import { QRCodeSVG } from 'qrcode.react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import SHA256 from "crypto-js/sha256";
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
  const [txInfo, setTxInfo] = useState(null);
  const [verifyFile, setVerifyFile] = useState(null);
  const [tamperStatus, setTamperStatus] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [accessLogs, setAccessLogs] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !secretKey || !caseID || !title || !category) {
      setStatus('❗ All fields are required');
      return;
    }

    try {
      setStatus('🔐 Encrypting file...');
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          // convert file to base64 and encrypt
          const wordArray = CryptoJS.lib.WordArray.create(event.target.result);
          const base64 = CryptoJS.enc.Base64.stringify(wordArray);
          const documentHash = SHA256(base64).toString();
          const encrypted = CryptoJS.AES.encrypt(base64, secretKey).toString();
          const blob = new Blob([encrypted], { type: 'text/plain' });

          setStatus('📤 Uploading encrypted file to IPFS...');
          const encryptedCid = await uploadToIPFS(blob); // keep your util
          setCid(encryptedCid);
          setFileName(file.name);

          setStatus('⛓️ Storing metadata on blockchain (pending tx)...');
          const { contractInstance, signerAddress, web3Instance } = await initContract();

          // send transaction with all fields (caseID, ipfsHash, title, category)
          const txReceipt = await contractInstance.methods
            .storeVerdict(
                  caseID,
                  encryptedCid,
                  documentHash,
                  title,
                  category
                )
            .send({ from: signerAddress })
            .on('transactionHash', (hash) => {
              // immediate feedback when tx is broadcast
              setStatus('⛳ Transaction broadcasted. Waiting confirmation...');
              setTxInfo({ txHash: hash, blockNumber: null, caseID, title, category, ipfsHash: encryptedCid });
            });

          // txReceipt should contain blockNumber and transactionHash after confirmation
          const confirmedTx = {
            txHash: txReceipt.transactionHash || (txInfo && txInfo.txHash),
            blockNumber: txReceipt.blockNumber,
            gasUsed: txReceipt.gasUsed,
          };

          setTxInfo(prev => ({ ...prev, ...confirmedTx }));
          setStatus('✅ File uploaded and metadata stored on-chain!');
        } catch (innerErr) {
          console.error('Upload/Blockchain error:', innerErr);
          setStatus('❌ Upload or blockchain storage failed');
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('❌ Upload error:', err);
      setStatus('❌ Unexpected error during upload');
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
      }, 1000);
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
        setVerificationResult(
          '🔎 Fetching verdict from blockchain...'
        );

        const { contractInstance } =
          await initContract();

        const result =
          await contractInstance.methods
            .getVerdict(caseID)
            .call();

        console.log("Blockchain Result:", result);

        const returnedCaseID =
          result.caseID || result[0];

        const ipfsHash =
          result.ipfsHash || result[1];

        const documentHash =
          result.documentHash || result[2];

        const resTitle =
          result.title || result[3];

        const resCategory =
          result.category || result[4];

        const timestamp =
          result.timestamp || result[5];

        const uploader =
          result.uploader || result[6];

        const status =
          result.status || result[7];

        const statusText =
          Number(status) === 0
            ? "ACTIVE"
            : Number(status) === 1
            ? "VERIFIED"
            : "REVOKED";

        setVerificationResult(
    `✅ Verdict Found

    Case ID:
    ${returnedCaseID}

    Title:
    ${resTitle}

    Category:
    ${resCategory}

    Status:
    ${statusText}

    IPFS Hash:
    ${ipfsHash}

    Document Hash:
    ${documentHash}

    Timestamp:
    ${new Date(
      Number(timestamp) * 1000
    ).toLocaleString()}

    Uploader:
    ${uploader}`
        );

        setCid(ipfsHash);

      } catch (error) {
        console.error(
          '❌ Verify error:',
          error
        );

        setVerificationResult(
          '❌ No verdict found or blockchain error'
        );
      }
    };

  const handleTamperCheck = async () => {

  if (!verifyFile || !caseID) {
    setTamperStatus(
      '❗ Select file and enter Case ID'
    );
    return;
  }

  try {

    setTamperStatus(
      '🔍 Verifying integrity...'
    );

    const { contractInstance } =
      await initContract();

    const result =
      await contractInstance.methods
        .getVerdict(caseID)
        .call();

    const blockchainHash =
      result.documentHash || result[2];

    const reader = new FileReader();

    reader.onload = async (event) => {

      try {

        const wordArray =
          CryptoJS.lib.WordArray.create(
            event.target.result
          );

        const base64 =
          CryptoJS.enc.Base64.stringify(
            wordArray
          );

        const calculatedHash =
          SHA256(base64).toString();

        console.log(
          "Blockchain Hash:",
          blockchainHash
        );

        console.log(
          "Calculated Hash:",
          calculatedHash
        );

        if (
          calculatedHash === blockchainHash
        ) {

          setTamperStatus(
            '✅ VERIFIED'
          );

        } else {

          setTamperStatus(
            '❌ TAMPERED'
          );
        }

      } catch (err) {

        console.error(err);

        setTamperStatus(
          '❌ Integrity check failed'
        );
      }
    };

    reader.readAsArrayBuffer(
      verifyFile
    );

  } catch (error) {

    console.error(error);

    setTamperStatus(
      '❌ Blockchain verification failed'
    );
  }
};

  const handleFetchLogs = async () => {

    if (!caseID) {
      alert("Enter Case ID");
      return;
    }

    try {

      const { contractInstance } =
        await initContract();

      const logs =
        await contractInstance.methods
          .getAccessLogs(caseID)
          .call();

      console.log("Access Logs:", logs);

      setAccessLogs(logs);

    } catch (err) {

      console.error(err);

      alert("Failed to fetch logs");
    }
  };

  const copyTxHash = async () => {
    if (!txInfo || !txInfo.txHash) return;
    try {
      await navigator.clipboard.writeText(txInfo.txHash);
      setStatus('📋 TX hash copied to clipboard');
      setTimeout(() => setStatus(''), 2000);
    } catch {
      setStatus('⚠️ Unable to copy TX hash');
    }
  };

  return (
    <div className="container animate__animated animate__fadeIn">
      <div className="card shadow-lg p-4">
        <h2 className="text-center text-primary">🧾 Secure Verdict Vault</h2>

        <form onSubmit={handleUpload}>
          <div className="mb-3">
            <label className="form-label fw-bold">Case ID:</label>
            <input type="text" className="form-control" value={caseID} onChange={(e) => setCaseID(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Document Title:</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category:</label>
            <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Choose File:</label>
            <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} accept=".jpeg,.jpg,.png,.txt,.doc,.docx,.pdf" required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Enter Secret Key:</label>
            <input type="password" className="form-control" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-success w-100">🔼 Encrypt & Upload</button>
        </form>

        <hr />

        <div className="mt-3">
          <label className="form-label fw-bold">Enter Secret Key to Decrypt:</label>
          <input type="password" className="form-control mb-2" value={downloadKey} onChange={(e) => setDownloadKey(e.target.value)} />
          <button className="btn btn-primary w-100" onClick={handleDownload}>🔽 Download & Decrypt</button>
        </div>

        <hr />

        <div className="mt-3">
          <label className="form-label fw-bold">Verify by Case ID:</label>
          <div className="d-flex">
            <input type="text" className="form-control me-2" placeholder="Enter Case ID" value={caseID} onChange={(e) => setCaseID(e.target.value)} />
            <button className="btn btn-warning" onClick={handleVerify}>Verify</button>
          </div>
          {verificationResult && <div className="alert alert-info mt-2" style={{ whiteSpace: 'pre-line' }}>{verificationResult}</div>}
        </div>

        <hr />

        <div className="mt-3">

          <label className="form-label fw-bold">
            File Integrity Verification:
          </label>

          <input
            type="file"
            className="form-control mb-2"
            onChange={(e) =>
              setVerifyFile(e.target.files[0])
            }
          />

          <button
            className="btn btn-danger w-100"
            onClick={handleTamperCheck}
          >
            🛡️ Verify File Integrity
          </button>

          {tamperStatus && (
            <div
              className={`alert mt-3 ${
                tamperStatus.includes('VERIFIED')
                  ? 'alert-success'
                  : 'alert-danger'
              }`}
            >
              {tamperStatus}
            </div>
          )}

</div>

        <hr />

        <div className="mt-4">

          <h5 className="fw-bold">
            📜 Chain of Custody Logs
          </h5>

          <button
            className="btn btn-dark w-100 mb-3"
            onClick={handleFetchLogs}
          >
            View Access Logs
          </button>

          {accessLogs.length > 0 && (

            <div className="list-group">

              {accessLogs.map((log, index) => (

                <div
                  key={index}
                  className="list-group-item"
                >

                  <div>
                    <strong>Action:</strong>
                    {" "}
                    {log.action}
                  </div>

                  <div>
                    <strong>User:</strong>
                    {" "}
                    {log.user}
                  </div>

                  <div>
                    <strong>Time:</strong>
                    {" "}
                    {new Date(
                      Number(log.timestamp) * 1000
                    ).toLocaleString()}
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
        
        {status && <div className="alert alert-secondary mt-3">{status}</div>}

        {txInfo && (
          <div className="alert alert-success mt-2">
            <div><b>✅ TX Status</b></div>
            <div>Case ID: {txInfo.caseID}</div>
            <div>Title: {txInfo.title}</div>
            <div>Category: {txInfo.category}</div>
            <div>IPFS: <a href={`https://ipfs.io/ipfs/${txInfo.ipfsHash}`} target="_blank" rel="noreferrer">{txInfo.ipfsHash}</a></div>
            <div>Block: {txInfo.blockNumber ?? 'pending'}</div>
            <div>
              TX Hash: <code>{txInfo.txHash}</code>
              <button className="btn btn-sm btn-outline-secondary ms-2" onClick={copyTxHash}>Copy TX</button>
            </div>
          </div>
        )}

        {cid && (
          <div className="qr-container mt-3">
            <label className="form-label fw-bold mb-2">Scan QR code to download file:</label>
            <QRCodeSVG value={`http://192.168.94.30:3000/decrypt?cid=${cid}&fileName=${fileName}`} size={160} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VerdictUpload;

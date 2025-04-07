// src/utils/ipfs.js
import { create } from 'ipfs-http-client';

const client = create({
  url: 'http://127.0.0.1:5001/api/v0', // Make sure your local IPFS node is running
});

export const uploadToIPFS = async (file) => {
  try {
    const added = await client.add(file);
    console.log('📁 IPFS Upload success:', added);
    return added.path;
  } catch (err) {
    console.error('🔥 IPFS Upload error:', err);
    throw err;
  }
};

import Web3 from 'web3';
import VerdictVaultABI from '../abi/VerdictVault.json';

const contractAddress = '0x37904E8Aa2bC57A931A1254F7cc582665ECA3248'.trim(); // Replace with actual address

let signerAddress;
let contractInstance;

export const initContract = async () => {
  if (!window.ethereum) throw new Error('🦊 MetaMask not detected');

  const web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  const accounts = await web3.eth.getAccounts();
  signerAddress = accounts[0];

  contractInstance = new web3.eth.Contract(VerdictVaultABI.abi, contractAddress);

  return { contractInstance, signerAddress };
};

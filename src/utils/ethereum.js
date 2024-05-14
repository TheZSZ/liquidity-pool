import { ethers } from 'ethers';

let provider;
let signer;

if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
} else {
  console.error('MetaMask not found');
}

const connectWallet = async () => {
  if (!window.ethereum) {
    console.error('MetaMask not found');
    return;
  }
  await provider.send('eth_requestAccounts', []);
  signer = provider.getSigner();
};

export { provider, signer, connectWallet };

import React from 'react';
import { connectWallet } from '../utils/ethereum';

const ConnectWallet = () => {
  const handleConnect = async () => {
    try {
      await connectWallet();
      alert('Wallet connected!');
    } catch (error) {
      console.error(error);
      alert('Failed to connect wallet.');
    }
  };

  return <button onClick={handleConnect}>Connect Wallet</button>;
};

export default ConnectWallet;

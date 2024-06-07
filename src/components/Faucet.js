import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { provider, signer } from '../utils/ethereum';
import TokenFaucetABI from '../contracts/Faucet.sol/Faucet.json';

const Faucet = () => {
  const [peachBalance, setPeachBalance] = useState(0);
  const [mangoBalance, setMangoBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const faucetAddress = '0xc765C1298695B7Ada706357bD026A460A418bB0C'; // Replace with your Faucet contract address

  // fetch the balance of peach and mango tokens currently in the faucet
  const fetchBalances = async () => {
    const faucetContract = new ethers.Contract(faucetAddress, TokenFaucetABI.abi, provider);
    const peachBalance = await faucetContract.getPeachBalance();
    const mangoBalance = await faucetContract.getMangoBalance();
    setPeachBalance(ethers.utils.formatUnits(peachBalance, 18));
    setMangoBalance(ethers.utils.formatUnits(mangoBalance, 18));
  };

  useEffect(() => {
    const faucetContract = new ethers.Contract(faucetAddress, TokenFaucetABI.abi, provider);

    // refresh the balances when tokens are requested
    const handlePeachTokensRequested = () => {
      fetchBalances();
    };

    const handleMangoTokensRequested = () => {
      fetchBalances();
    };

    // on event listeners
    faucetContract.on("PeachTokensRequested", handlePeachTokensRequested);
    faucetContract.on("MangoTokensRequested", handleMangoTokensRequested);

    fetchBalances();

    return () => {
      faucetContract.off("PeachTokensRequested", handlePeachTokensRequested);
      faucetContract.off("MangoTokensRequested", handleMangoTokensRequested);
    };
  }, []);

  // request Peach tokens from the faucet
  const handleRequestPeach = async () => {
    try {
      const faucetContract = new ethers.Contract(faucetAddress, TokenFaucetABI.abi, signer);
      const tx = await faucetContract.requestPeachTokens(await signer.getAddress(), ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      setMessage('Peach tokens requested successfully!');
      fetchBalances(); // fetch balances after request
    } catch (error) {
      console.error(error);
      setMessage('Failed to request Peach tokens.');
    }
  };

  // request mango tokens from the faucet
  const handleRequestMango = async () => {
    try {
      const faucetContract = new ethers.Contract(faucetAddress, TokenFaucetABI.abi, signer);
      const tx = await faucetContract.requestMangoTokens(await signer.getAddress(), ethers.utils.parseUnits(amount, 18));
      await tx.wait();
      setMessage('Mango tokens requested successfully!');
      fetchBalances();
    } catch (error) {
      console.error(error);
      setMessage('Failed to request Mango tokens.');
    }
  };

  return (
    <div>
      <h2>Token Faucet</h2>
      <p>Peach Token Balance: {peachBalance}</p>
      <p>Mango Token Balance: {mangoBalance}</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to request"
      />
      <button onClick={handleRequestPeach}>Request Peach Tokens</button>
      <button onClick={handleRequestMango}>Request Mango Tokens</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Faucet;

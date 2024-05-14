// components/StakePeach.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
// import { signer } from '../utils/ethereum';
import PeachTokenABI from '../contracts/Peach.sol/Peach.json'; // Import the ABI of your PeachToken contract

const StakePeach = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleStake = async () => {
    try {
      const peachTokenAddress = '0xYourPeachTokenAddress'; // Replace with your PeachToken contract address
    //   const peachTokenContract = new ethers.Contract(peachTokenAddress, PeachTokenABI, signer);
    //   const tx = await peachTokenContract.stakePeach(ethers.utils.parseUnits(amount, 18));
    //   await tx.wait();
      setMessage('Staking successful!');
    } catch (error) {
      console.error(error);
      setMessage('Staking failed.');
    }
  };

  return (
    <div>
      <h2>Stake Peach Tokens</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to stake"
      />
      <button onClick={handleStake}>Stake</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default StakePeach;

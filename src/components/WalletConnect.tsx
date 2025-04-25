'use client';

import { useEffect, useState } from 'react';
import { connectWallet, keplrChainIds } from '../utils/connectWallet';

type Props = {
  selectedChainKey: string;
  onConnected: (walletAddress: string) => void;
};

const shorten = (str: string, len = 6) =>
  str.length <= len * 2 ? str : `${str.slice(0, len)}...${str.slice(-len)}`;

export default function WalletConnect({ selectedChainKey, onConnected }: Props) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    const address = await connectWallet(selectedChainKey);
    if (address) {
      setWalletAddress(address);
      onConnected(address);
    }
  };

  useEffect(() => {
    const reEnable = async () => {
      if (!walletAddress) return;
      const chainId = keplrChainIds[selectedChainKey];
      try {
        await window.keplr?.enable(chainId);
        const offlineSigner = window.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        if (accounts.length > 0 && accounts[0].address !== walletAddress) {
          setWalletAddress(accounts[0].address);
          onConnected(accounts[0].address);
        }
      } catch (err) {
        console.warn(`Keplr failed to switch to ${chainId}:`, err);
      }
    };
    reEnable();
  }, [selectedChainKey, walletAddress, onConnected]);

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={handleConnect}
        style={{
          backgroundColor: '#333',
          color: 'white',
          padding: '10px 15px',
          borderRadius: 6,
          border: '1px solid #555',
          cursor: 'pointer',
          width: '100%',
          fontFamily: 'monospace',
          fontSize: '1rem',
        }}
      >
        {walletAddress ? `Connected: ${shorten(walletAddress, 8)}` : 'Connect Keplr Wallet'}
      </button>
    </div>
  );
}

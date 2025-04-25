'use client';

import { useState } from 'react';
import { DeliverTxResponse, SigningStargateClient } from '@cosmjs/stargate';

type Props = {
  validatorAddress: string;
  validatorMoniker: string;
  chain: string;
  denom: string;
  walletAddress: string;
  onClose: () => void;
};

export default function StakeModal({
  validatorAddress,
  validatorMoniker,
  chain,
  denom,
  walletAddress,
  onClose,
}: Props) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStake = async () => {
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      await window.keplr?.enable(chain);
      const offlineSigner = window.getOfflineSigner(chain);
      const client = await SigningStargateClient.connectWithSigner(
        `https://rpc.cosmos.directory/${chain.selectedChainKey}`,
        offlineSigner
      );

      const amountInMicro = (parseFloat(amount) * 1_000_000).toFixed(0);
      const result: DeliverTxResponse = await client.delegateTokens(
        walletAddress,
        validatorAddress,
        {
          denom: denom.toLowerCase(),
          amount: amountInMicro,
        },
        'auto'
      );

      setTxHash(result.transactionHash);
    } catch (err: any) {
      setError(err.message || 'Failed to stake');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#222', padding: 24, borderRadius: 12,
        width: 400, color: 'white', fontFamily: 'monospace',
      }}>
        <h2>Stake to {validatorMoniker}</h2>

        <label style={{ display: 'block', margin: '16px 0 4px' }}>Amount ({denom})</label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: '100%', padding: 8, borderRadius: 4,
            border: '1px solid #555', backgroundColor: '#111', color: 'white'
          }}
        />

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={{
            padding: '8px 12px', backgroundColor: '#555', color: 'white',
            borderRadius: 4, cursor: 'pointer',
          }}>Cancel</button>

          <button onClick={handleStake} disabled={loading} style={{
            padding: '8px 12px', backgroundColor: '#00cc88', color: 'black',
            borderRadius: 4, fontWeight: 'bold', cursor: 'pointer',
          }}>
            {loading ? 'Staking...' : 'Stake'}
          </button>
        </div>

        {txHash && <div style={{ marginTop: 20, color: '#0f0' }}>Success! Tx Hash: {txHash}</div>}
        {error && <div style={{ marginTop: 20, color: '#f44' }}>{error}</div>}
      </div>
    </div>
  );
}

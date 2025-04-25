export const keplrChainIds: Record<string, string> = {
    cosmoshub: 'cosmoshub-4',
    osmosis: 'osmosis-1',
    planq: 'planq_7070-2',
    stargaze: 'stargaze-1',
    Akash: 'akashnet-2',
    Crossfi: 'crossfi-1',
  };
  
  export async function connectWallet(selectedChainKey: string): Promise<string | null> {
    try {
      const chainId = keplrChainIds[selectedChainKey];
  
      if (!window.keplr || !window.getOfflineSigner) {
        alert('Please install the Keplr Wallet extension.');
        return null;
      }
  
      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
  
      return accounts[0].address;
    } catch (error) {
      console.error('Failed to connect Keplr wallet:', error);
      return null;
    }
  }
  
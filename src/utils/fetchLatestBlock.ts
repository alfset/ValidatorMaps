export const fetchLatestBlockFromChain = async (baseUrl: string) => {
    try {
      const response = await fetch(`${baseUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`);
      const data = await response.json();
      if (!data.block) {
        throw new Error("Latest block not found.");
      }
      return {
        block_height: data.block.header.height,
        proposer_moniker: data.block.header.proposer_address,
        block_time: data.block.header.time,
      };
    } catch (error) {
      console.error("Error fetching latest block:", error);
      return null;
    }
  };
  
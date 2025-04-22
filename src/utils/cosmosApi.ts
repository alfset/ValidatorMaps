export const fetchValidatorsFromChain = async (baseUrl: string, denom: string) => {
  try {
    const response = await fetch(`${baseUrl}/cosmos/staking/v1beta1/validators??status=BOND_STATUS_BONDED`);
    const data = await response.json();
    if (!data.validators) {
      throw new Error("Validators not found.");
    }
    return data.validators.map((validator: any) => ({
      operator_address: validator.operator_address,
      description: validator.description,
      tokens: validator.tokens,
      status: validator.status,
      denom,
    }));
  } catch (error) {
    console.error("Error fetching validators:", error);
    return [];
  }
};

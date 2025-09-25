export const CONTRACTS = {
    testnet: "0x89A2C29B55Fb31E5739682f5b9aE3a004E7a1a54"  // Manna KRW-S Contract on Kaia Testnet
} as const;

export type NetworkType = keyof typeof CONTRACTS;

export const getContractAddress = (network: NetworkType) => CONTRACTS[network];

export const shortenAddress = (address: string, length = 4): string => {
    if (typeof address !== "string" || address.length <= 2 * length) {
        return address;
    }
    return `${address.slice(0, length)}...${address.slice(-length)}`;
};

// Helper function to format KRW-S amounts with proper decimal places
export const formatKRWS = (amount: bigint | string | number, decimals: number = 18): string => {
    try {
        const bigIntAmount = typeof amount === 'bigint' ? amount : BigInt(amount);
        const divisor = BigInt(10 ** decimals);
        const whole = bigIntAmount / divisor;
        const fraction = bigIntAmount % divisor;
        
        if (fraction === BigInt(0)) {
            return whole.toString();
        }
        
        const fractionStr = fraction.toString().padStart(decimals, '0');
        const trimmedFraction = fractionStr.replace(/0+$/, '');
        
        return `${whole}.${trimmedFraction}`;
    } catch (error) {
        console.error('Error formatting KRW-S amount:', error);
        return '0';
    }
};

// Helper function to parse KRW-S amounts from user input
export const parseKRWS = (amount: string, decimals: number = 18): bigint => {
    try {
        const [whole, fraction = ''] = amount.split('.');
        const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
        const wholeBigInt = BigInt(whole || '0');
        const fractionBigInt = BigInt(paddedFraction);
        const multiplier = BigInt(10 ** decimals);
        
        return wholeBigInt * multiplier + fractionBigInt;
    } catch (error) {
        console.error('Error parsing KRW-S amount:', error);
        return BigInt(0);
    }
};
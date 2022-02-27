export interface MetaDataContent {
    image?: string,
    properties?: {
        creators?: {
            address?: string,
        }[],
    },
}

export interface TokenInfo {
    isNative: boolean,
    mint: string,
    owner: string,
    state: string,
    tokenAmount: {
        amount: string,
        decimals: number,
        uiAmount: number,
        uiAmountString: string,
    }
}

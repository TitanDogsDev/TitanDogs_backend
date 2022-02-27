import { Connection, Cluster, clusterApiUrl } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { MetaDataContent, TokenInfo } from "../interfaces/tokenInterface";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import tokenService from "../services/tokenService";

const tokenController = {
    getTokens: async (pubKeyString: string | undefined, authorityKey: string | undefined) => {
        try {
            const cluster: Cluster = process.env.SOLANA_NETWORK === "mainnet-beta" ? "mainnet-beta" : "devnet";
            const connection = new Connection(clusterApiUrl(cluster), "confirmed");

            if (pubKeyString) {
                let accounts = await connection.getParsedProgramAccounts(
                    TOKEN_PROGRAM_ID,
                    {
                        filters: [
                            {
                                dataSize: 165,
                            },
                            {
                                memcmp: {
                                    offset: 32,
                                    bytes: pubKeyString,
                                },
                            },
                        ],
                    }
                );

                if (accounts && accounts.length > 0) {
                    let tokenList : TokenInfo[] = accounts.map((accountInfo: { account: { data: any } }) => accountInfo?.account?.data?.parsed?.info);
                    let ownedTokens = tokenList.filter(token => parseInt(token.tokenAmount?.amount) > 0 && token.owner === pubKeyString);
                    let ownedTokenData: Metadata[] = [];
                    for (let token of ownedTokens) {
                        let tokenData = await tokenService.getTokenData(connection, token)
                        if (tokenData) {
                            ownedTokenData.push(tokenData);
                        }
                    }

                    let tokens: Metadata[] = [];
                    if (authorityKey) {
                        tokens = tokenService.getCollectionTokens(ownedTokenData, authorityKey);
                    } else {
                        tokens = ownedTokenData;
                    }

                    let metaDataList: MetaDataContent[] = [];
                    for (let tokenData of tokens) {
                        let metaData: MetaDataContent = await tokenService.getMetaData(tokenData);
                        if (metaData) {
                            metaDataList.push(metaData);
                        }
                    }

                    return metaDataList;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default tokenController;
import fetch from "node-fetch";
import { Connection } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { MetaDataContent } from "../interfaces/tokenInterface";
import { PublicKey } from "@solana/web3.js";

const tokenService = {
    getTokenData: async (connection: Connection, token: { mint: string }) => {
        if (token && token.mint) {
            let mintPubkey = new PublicKey(token.mint);
            let tokenmetaPubkey = await Metadata.getPDA(mintPubkey);
            let tokenData: Metadata = await Metadata.load(connection, tokenmetaPubkey);
            return tokenData;
        }
    },
    getCollectionTokens: (tokensData: any[], authorityKey: string | undefined) => {
        let collectionTokenData: any[] = [];
        if (tokensData?.length > 0) {
            collectionTokenData = tokensData.filter(token => (
                token.data.updateAuthority === authorityKey
            ))
        }
        return collectionTokenData;
    },
    getMetaData: async (tokenData: Metadata) => {
        let metaData: MetaDataContent = {};
        if (tokenData) {
            let metaDataUri = tokenData.data?.data?.uri;
            let response = await fetch(metaDataUri)
                .then(res => res.json())
                .catch(err => { console.log(err) })
            if (response && response.image) {
                metaData = response;
            }
        }
        return metaData;
    }
}

export default tokenService;
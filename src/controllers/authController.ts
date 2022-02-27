import { Request, Response } from "express";
import tokenController from "./tokenController";

const authController = {
    verify: async (req: Request, res: Response) => {
        let pubKey: string = req.body.pubKey;

        if (!pubKey) {
            return res.status(400).json({ message: 'Error. Please connect wallet and send pubKey to verify.' });
        }

        let collectionTokens = await tokenController.getTokens(pubKey, process.env.SOL_TREASURY_KEY);
        let isHolder: boolean = collectionTokens && collectionTokens?.length > 0 ? true : false;

        if (!isHolder) {
            return res.status(401).json({ message: 'User not verified as collection holder.' });
        }

        return res.json(
            {
                data: collectionTokens,
                message: 'User successfully verified as collection holder.'
            }
        );
    }
}

export default authController;
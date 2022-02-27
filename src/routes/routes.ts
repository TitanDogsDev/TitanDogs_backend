import { Application, Request, Response } from 'express'
import authController from '../controllers/authController';

const routes = (app: Application) => {
    app.get('/', (req: Request, res: Response) => {
        res.send("Hello world!");
    });

    app.post('/verify', authController.verify);
}

export default routes;
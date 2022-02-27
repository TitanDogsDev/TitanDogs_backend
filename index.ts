import express, { Application } from 'express'
import cors, { CorsOptions } from "cors";
import helmet from "helmet";

import routes from "./src/routes/routes";

const app: Application = express();

require("dotenv").config();

// const allowedOrigins = ["*"];

const options: CorsOptions = {
    origin: "*"
};

app.use(cors(options));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

routes(app);
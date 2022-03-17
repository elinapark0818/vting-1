import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/.env' });

const PORT = process.env.PORT;

const app: express.Application = express();

app.use((req: Request, res: Response, next: NextFunction) => {
	res.render('Hello world');
});

app.use(((err, req, res, next) => {
	res.status(500).send(err.message);
}) as ErrorRequestHandler);

app.listen(PORT, () => console.log('Running on TS-Express Server')).on('error', (err) => {
	throw new Error(`${err.name}: ${err.message}`);
});

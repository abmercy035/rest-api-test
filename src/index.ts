import config from "config"
import connect from './utils/connect';
import createServer from './utils/server';

const port = config.get<number>("port")

const app = createServer();


app.listen(port, async () => {
	await connect();
	console.log(`app is running on http://localhost:${port}`);
});
 
export default app;

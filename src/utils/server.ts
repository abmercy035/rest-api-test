import express from "express"
import routes from "./../routes"
import deserializeUser from "../middleware/desializeUser";
function createServer() {
	const app = express();

	app.use(express.json());
	app.use(deserializeUser);

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Refresh, Content-Type, Accept, Authorization");
		res.header('Access-Control-Allow-Credentials', "true");
		next();
	});

	routes(app)
return app;
}

export default createServer;

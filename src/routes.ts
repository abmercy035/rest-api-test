import { Express, Request, Response } from "express"
import { createUserHandler, deleteUserHandler, getAllUserHandler, getUserHandler, updateUserHandler } from "./controller/user.controller";
import validateResource from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { createSessionSchema } from "./schema/session.schema";
import { createSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "./controller/session.controller";
import requireUser from "./middleware/requireUser";
function routes(app: Express) {
	app.get('/healthcheck', (req: Request, res: Response) => {
		res.status(200).send("app is healthy");
	})
	app.post("/api/users", validateResource(createUserSchema), createUserHandler);
	app.get("/api/user", getUserHandler);
	app.get("/api/users", getAllUserHandler);
	app.put("/api/user", updateUserHandler);
	app.delete("/api/user", deleteUserHandler);

}

export default routes;

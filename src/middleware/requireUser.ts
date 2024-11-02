
import { NextFunction, Request, Response } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction): void => {
	const user = res.locals.user;
	if (!user) {
		res.sendStatus(403);
		return;
	}
	next();
}
export default requireUser;

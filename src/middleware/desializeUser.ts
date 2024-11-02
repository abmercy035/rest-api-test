import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import log from "../utils/logger";
import { reIssueAccessToken } from "../controller/session.controller";

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = get(req.headers, "authorization", "").replace(/^Bearer\s/, "");
	const refreshToken = get(req.headers, "x-refresh");
	if (!accessToken) return next();
	const { decoded, expired } = verifyJwt(accessToken);
	if (decoded) {
		res.locals.user = decoded;
		return next();
	}
	if (expired && refreshToken) {
		const newAccessToken = await reIssueAccessToken({ refreshToken: refreshToken as string })
		log("expired")
		if (newAccessToken) {
			res.setHeader("x-access-token", newAccessToken)
		}
		const result = verifyJwt(newAccessToken as string)
		return next();
	}
	return next();
}

export default deserializeUser;

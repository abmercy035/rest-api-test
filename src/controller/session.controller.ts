import config from "config";
import SessionModel from "../model/sessions.model";
import { createSession, findSessions, updateSession, } from "../service/session.service";
import { deleteUser, findUser, validatePassword } from "../service/user.service";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { Request, Response } from "express";
import log from "../utils/logger";
import { get } from "lodash";
import UserModel from "../model/user.model";

export async function createSessionHandler(req: Request, res: Response): Promise<void> {
	// Validate the user's password
	const user = await validatePassword(req.body);
	if (!user) {
		res.status(401).send("Invalid email or password");
		return;
	}
	// Create a session
	const session = await createSession(user._id.toString(), req.get("user-agent") || "");
	// Create an access token
	const accessToken = signJwt(
		{ ...user, session: session._id },
		{ expiresIn: config.get("accessTokenTtl") } // 15 minutes
	);
	// Create a refresh token
	const refreshToken = signJwt(
		{ ...user, session: session._id },
		{ expiresIn: config.get("refreshTokenTtl") } // 1 year
	);
	// Send the tokens
	res.send({ accessToken, refreshToken });
}
export async function getUserSessionsHandler(req: Request, res: Response): Promise<void> {
	// get user
	// log(res.locals.user)
	const userId = await res.locals.user.id;
	// find sessions
	const sessions = await findSessions({ user: userId, valid: true });
	res.send(sessions);
}


export async function deleteSessionHandler(req: Request, res: Response): Promise<void> {
	const session = res.locals.user.session;
	await updateSession({ _id: session }, { valid: false });
	res.send({
		accessToken: null,
		refreshToken: null
	})
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
	// Decode the refresh token
	const { decoded } = verifyJwt(refreshToken);
	if (!decoded || !get(decoded, "session")) return false;
	// Get the session
	const session = await SessionModel.findById(get(decoded, "session"));
	// Make sure the session is still valid
	if (!session || !session.valid) return false;
	const user = await findUser({ _id: session.user });
	// Create a new access token
	if (!user) return false
	const accessToken = signJwt(
		{ ...user, session: session._id },
		{ expiresIn: config.get("accessTokenTtl") } // 15 minutes
	);
	return accessToken;
}

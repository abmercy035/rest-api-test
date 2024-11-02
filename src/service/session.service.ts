import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel from "../model/sessions.model";
import { SessionInterface } from "../interface/session.interface";

export async function createSession(userId: string, userAgent: string) {

	const session = await SessionModel.create({ user: userId, userAgent });
	return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionInterface>) {
	return SessionModel.find(query).lean();
}
export async function updateSession(
	query: FilterQuery<SessionInterface>,
	update: UpdateQuery<SessionInterface>) {
	return SessionModel.updateOne(query, update);
	// deleteUserHandler(req: Request, res: Response): Promise<void> {
}

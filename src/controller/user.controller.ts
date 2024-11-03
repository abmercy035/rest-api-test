import { CreateUserInput, createUserSchema } from './../schema/user.schema';
import { Request, Response } from "express"
import { createUser, deleteUser, findAllUser, findUser, updateUser } from "../service/user.service"
import { comparePassword, hashPassword } from "../utils/auth.bcrypt"
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import cookieExtractor from '../utils/cookieExtractor';
import log from '../utils/logger';
import { omit } from 'lodash';


export async function createUserHandler(req: Request, res: Response): Promise<void> {
	try {
		const { password, ...rest } = req.body;
		const hashedPassword = await hashPassword(password);

		const user = await createUser({ ...rest, password: hashedPassword })
		const token = signJwt(user._id, { expiresIn: "1d" })
		log({ msg: "token:", token })
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			path: "/",
			maxAge: 78 * 60 * 60 * 1000 // 3 days
		});

		res.json(user);
	} catch (e: any) {
		res.status(409).json({ err: { message: "user already exist with that email" } });
	}
}
export async function getUserHandler(req: Request, res: Response): Promise<void> {
	try {
		const { password, email } = req.body;
		const userFound = await findUser({ email: email });
		if (userFound) {
			const isPasswordAMatch = await comparePassword(password, userFound.password);
			if (isPasswordAMatch) {
				const token = signJwt(userFound._id, { expiresIn: "1d" });
				res.cookie('token', token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
					path: "/",
					maxAge: 78 * 60 * 60 * 1000 // 3 days
				});
				res.json(omit(userFound, ["password"]));
				return;
			}
			else {
				res.status(401).json({ err: { message: "password is incorrect" } });
				return;
			}
		}
		else {
			res.status(401).json({ err: { message: "user not found" } });
			return;
		}
	}
	catch (e: any) {
		res.status(409).json({ err: { message: "user already exist with that email" } });
	}
}
export async function getAllUserHandler(req: Request, res: Response): Promise<void> {
	try {
		const token = await cookieExtractor(req);
		if (token) {
			const { valid, expired, decoded } = verifyJwt(token.toString());
			if (valid && !expired && decoded) {
				const userFound = await findAllUser();
				res.json(userFound);
			}
			else {
				res.status(401).json({ err: { message: "session expired" } });
				return;
			}
		}
		else {
			res.status(401).json({ err: { message: "You are not logged in" } });
			return;
		}
	}
	catch (e: any) {
		res.status(500).json({ err: { message: "something went wrong" } });
	}
}
export async function updateUserHandler(req: Request, res: Response): Promise<void> {
	try {
		const token = await cookieExtractor(req);

		const data = req.body;
		if (token) {
			const { valid, expired, decoded } = verifyJwt(token);
			if (valid && !expired && decoded) {
				log(decoded);
				const userFound = await updateUser({ _id: decoded.id, }, data);
				if (userFound) {
					const token = signJwt(userFound._id, { expiresIn: "1d" });
					res.cookie('token', token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
						path: "/",
						maxAge: 78 * 60 * 60 * 1000 // 3 days
					});
					const updatedUser = await updateUser(userFound._id, data);
					res.json(omit(updatedUser, ["password"]));
				}
				else {
					res.status(401).json({ err: { message: "user not found" } });
					return;
				}
			}
			else {
				res.status(401).json({ err: { message: "Please login" } });
				return;
			}
		}
	}
	catch (e: any) {
		res.status(409).json({ err: { message: "user already exist with that email" } });
	}
}
export async function deleteUserHandler(req: Request, res: Response): Promise<void> {
	try {
		const token = await cookieExtractor(req);

		const data = req.body;
		if (token) {
			const { valid, expired, decoded } = verifyJwt(token);
			if (valid && !expired && decoded) {
				log(decoded);
				const userFound = await deleteUser({ _id: decoded.id, });
				if (userFound) {
					// const isPasswordAMatch = await comparePassword(password, userFound.password);
					// if (isPasswordAMatch) {
					const token = signJwt(userFound._id, { expiresIn: "1d" });
					res.cookie('token', token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
						path: "/",
						maxAge: 78 * 60 * 60 * 1000 // 3 days
					});
					const updatedUser = await updateUser(userFound._id, data);
					res.json(omit(updatedUser, ["password"]));

					// }
					// else {
					// 	res.status(401).json({ err: { message: "password is incorrect" } });
					// 	return;
					// }
				}
				else {
					res.status(401).json({ err: { message: "user not found" } });
					return;
				}
			}
			else {
				res.status(401).json({ err: { message: "Please login" } });
				return;
			}
		}
	}
	catch (e: any) {
		res.status(409).json({ err: { message: "user already exist with that email" } });
	}
}

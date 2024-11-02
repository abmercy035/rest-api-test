import { CreateUserInput, createUserSchema } from './../schema/user.schema';
import { Request, Response } from "express"
import { createUser, deleteUser } from "../service/user.service"
import { comparePassword, hashPassword } from "../utils/auth.bcrypt"
export async function createUserHandler(req: Request, res: Response): Promise<void> {
	try {
		const { password, ...rest } = req.body;
		const hashedPassword = await hashPassword(password);
		const user = await createUser({ ...rest, password: hashedPassword });
		res.json(user);
	} catch (e: any) {
		res.status(409).send(e.message);
	}
}

export async function deleteUserHandler(req: Request, res: Response): Promise<void> {
	try {
		const { password } = req.body;
		const session = res.locals.user.session;
		const isCorrectPassword = await comparePassword(password);

		if (session && isCorrectPassword)
			await deleteUser({ _id: session });
		res.send("deleted");
	} catch (e: any) {
		res.status(409).send(e.message);
	}
}


// export async function deleteUserHandler(req: Request, res: Response): Promise<void> {
// 	res.status(200).send("user deleted")
// }

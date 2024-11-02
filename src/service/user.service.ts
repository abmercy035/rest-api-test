import { UserInterface } from './../interface/user.interface';
import { omit } from 'lodash';

import UserModel from "../model/user.model"
import { comparePassword, hashPassword } from "../utils/auth.bcrypt";
import { FilterQuery } from 'mongoose';
import SessionModel from '../model/sessions.model';


export async function createUser(input: Omit<UserInterface, 'createdAt' | 'updatedAt'>) {
	try {
		const user = await UserModel.create(input)
		const { password, ...rest } = user.toJSON();
		return omit(user.toJSON(), ["password"]);
	}
	catch (e: any) {
		throw new Error(e.message)
	}
}

export async function validatePassword({ email, password }: { email: string, password: string }) {
	const user = await UserModel.findOne({ email });
	if (!user) {
		return false;
	}
	else {
		const isValid = await comparePassword(password)
		if (!isValid) return false;
		return omit(user.toJSON(), ['password']);
	}
}

export async function findUser(query: FilterQuery<UserInterface>) {
	return await UserModel.findOne(query).lean()
}

export async function deleteUser(query: FilterQuery<UserInterface>) {
	try {
		const session = await SessionModel.findOne(query);
		if (session && session.user) {
			await UserModel.deleteOne({ _id: session.user });
		}
		return;
	}
	catch (e: any) {
		throw new Error(e.message);
	}
}

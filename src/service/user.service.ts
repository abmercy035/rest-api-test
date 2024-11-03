import { UserInterface } from './../interface/user.interface';
import { omit } from 'lodash';

import UserModel from "../model/user.model"
import { comparePassword, hashPassword } from "../utils/auth.bcrypt";
import { FilterQuery } from 'mongoose';
import SessionModel from '../model/sessions.model';
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import log from '../utils/logger';


export async function createUser(input: Omit<UserInterface, 'createdAt' | 'updatedAt'>) {
	try {
		const user = await UserModel.create(input)
		log(user)
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
		const isValid = await comparePassword(password, user.password)
		if (!isValid) return false;
		return omit(user.toJSON(), ['password']);
	}
}

export async function findUser(query: FilterQuery<UserInterface>) {
	return await UserModel.findOne(query).lean()
}
export async function findAllUser(query?: any) {
	return await UserModel.find(query).lean()
}
export async function updateUser(query: any, data: FilterQuery<UserInterface>) {
	return await UserModel.findOneAndUpdate(query, data).lean()
}
export async function deleteUser(query: FilterQuery<UserInterface>) {
	try {
		return await UserModel.findOneAndDelete(query).lean()
	}
	catch (e: any) {
		throw new Error(e.message);
	}
}

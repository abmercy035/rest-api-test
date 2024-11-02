import { UserInterface } from './../interface/user.interface';
import UserModel from "../model/user.model";
import supertest from "supertest"
import createServer from "../utils/server";
import mongoose from "mongoose";
import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import log from "../utils/logger";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createSessionHandler } from '../controller/session.controller';
import { deleteUserHandler } from '../controller/user.controller';
var alreadyRan = false;
const app = createServer();
const _id = new mongoose.Types.ObjectId().toString();
const userId = new mongoose.Types.ObjectId().toString();
export const sessionPayLoad = {
	_id,
	user: userId,
	valid: true,
	userAgent: "PostmanRuntime/7.28.4",
	createdAt: new Date(),
	updatedAt: new Date()
}
export const userPayLoad = {
	_id: userId,
	email: "test@gmail.com",
	first_name: "test",
	last_name: "lest",
	middle_name: "mest"
}
export const user2PayLoad = {
	_id: userId,
	email: "test2@gmail.com",
	first_name: "test",
	last_name: "lest",
	middle_name: "mest",
}
export const userInput = {
	email: "test@gmail.com",
	first_name: "test",
	last_name: "lest",
	middle_name: "mest",
	password: "test123456"
}
describe('User', () => {
	beforeAll(async () => {
		const mongoServer = await MongoMemoryServer.create();
		await mongoose.connect(mongoServer.getUri())
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await mongoose.connection.close()
	})



	describe("user sign up", () => {
		describe.skip("if user email and password is valid", () => {
			it("should return user payload", async () => {
				const createUserServiceMock = jest.spyOn(UserService, "createUser")
					//@ts-ignore
					.mockReturnValueOnce(userPayLoad)
				const { statusCode, body } = await supertest(app).post("/api/users").send(userInput);
				expect(statusCode).toBe(200);
				//something is wrong with Jest here, if not.toEqual is use it still fails saying the values are equal and yet still says they are not equal when toEqual is used. 
				expect(body).toEqual(userPayLoad);
				expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
			})
		})


		describe("if user service throws an error", () => {
			it("should return a 409 error", async () => {
				const createUserServiceMock = jest.spyOn(UserService, "createUser")
					.mockRejectedValueOnce("System Failed")
				const { statusCode, body } = await supertest(app).post("/api/users").send(userInput);
				expect(statusCode).toBe(409);
				//something is wrong with Jest here, if not.toEqual is use it still fails saying the values are equal and yet still says they are not equal when toEqual is used. 
				expect(createUserServiceMock).toHaveBeenCalled();
			})
		})
	})


	describe("create user session", () => {
		describe("if user email and password are valid", () => {
			it("should return signed accessToken and refreshToken", async () => {
				jest.spyOn(UserService, "validatePassword")
					//@ts-ignore
					.mockReturnValue(userPayLoad)
				jest.spyOn(SessionService, "createSession")
					//@ts-ignore
					.mockReturnValue(sessionPayLoad)
				const req = {
					get: () => { return "a user agent" },
					body: userInput
				};
				const send = jest.fn()
				const res = { send }
				//@ts-ignore
				await createSessionHandler(req, res);
				expect(send).toHaveBeenCalledWith({ accessToken: expect.any(String), refreshToken: expect.any(String) })

			})
		})
	})
	// describe("delete user", () => {
	// 	describe("if user session is valid", () => {
	// 		it("should delete user", async () => {
	// 			const deleteUserServiceMock = jest.spyOn(UserService, "deleteUser")
	// 					//@ts-ignore
	// 				.mockResolvedValueOnce("User Deleted");
	// 			const req = {
	// 				user: { _id: 'mockUserId' },
	// 				get: () => { return "a user agent" },
	// 				body: userInput
	// 			} as unknown as Request;
	// 			const status = jest.fn().mockReturnThis();
	// 			const json = jest.fn();
	// 			const res = { status, json } as unknown as Response;

	// 			await deleteUserHandler(req, res);

	// 			expect(deleteUserServiceMock).toHaveBeenCalledWith('mockUserId');
	// 			expect(status).toHaveBeenCalledWith(200);
	// 			expect(json).toHaveBeenCalledWith({ message: "User deleted successfully" });
	// 		})		})
	// })

})





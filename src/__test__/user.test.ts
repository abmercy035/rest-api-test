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
	email: "test13@gmail.com",
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
	email: "test12@gmail.com",
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
		describe.only("if user email and password is valid", () => {
			it("should return user payload", async () => {
				const createUserServiceMock = jest.spyOn(UserService, "createUser")
					//@ts-ignore
					.mockReturnValueOnce(userPayLoad)
				log(userPayLoad)
				const { statusCode, body } = await supertest(app).post("/api/users").send(userInput);
				log(body)
				expect(body).toEqual(userPayLoad);
				expect(statusCode).toBe(200);
				//something is wrong with Jest here, if not.toEqual is use it still fails saying the values are equal and yet still says they are not equal when toEqual is used. 
				expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
			})
		})


	})
})





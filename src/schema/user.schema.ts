import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
	body: object({
		email: string({
			required_error: "Email is required"
		}).email("Not a valid email"),
		password: string({
			required_error: "Password is required"
		}).min(8, "Password should be at least 8 characters long"),
		first_name: string({
			required_error: "First name is required"
		}),
		last_name: string({
			required_error: "Last name is required"
		}),
		middle_name: string({
			required_error: "Middle name is required"
		})
	})
});

export type CreateUserInput =
	TypeOf<typeof createUserSchema>;

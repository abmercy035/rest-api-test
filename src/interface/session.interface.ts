import { UserInterface } from "./user.interface";
export interface SessionInterface {
	user: string;
	valid: boolean;
	userAgent: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

import bcrypt from "bcrypt"
import config from "config"

export async function hashPassword(password: string) {
	const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"))
	return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string) {
	const hash = await hashPassword(password)
	return bcrypt.compare(password, hash)
}

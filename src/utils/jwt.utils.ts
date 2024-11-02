import jwt from 'jsonwebtoken';
import config from 'config';
const privateKey = config.get<string>('privateKey');
const publicKey = config.get<string>('publicKey');

function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
	return jwt.sign({ id: object }, privateKey, {
		...(options && options),
		// algorithm: 'RS256',
	})
}
function verifyJwt(token: string) {
	try {
		const decoded = jwt.verify(token, privateKey);
		return {
			valid: true,
			expired: false,
			decoded,
		};
	} catch (e: any) {
		return {
			valid: false,
			expired: e.message === 'jwt expired',
			decoded: null,
		};
	}
}

export { signJwt, verifyJwt };

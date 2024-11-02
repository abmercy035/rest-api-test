import { Request } from "express";

const cookieExtractor = function (req: Request) {
	var appCookies = (req?.headers?.cookie?.split(";"));
	const cname = "token"
	if (appCookies)
		for (const item of appCookies) {
			if (item.trim().startsWith(`${cname}=`)) {
				return (item.trim().substr(cname.length + 1))
			}
		}
	return null
};


export default cookieExtractor;

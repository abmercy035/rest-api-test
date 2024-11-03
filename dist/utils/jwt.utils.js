"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
var privateKey = config_1.default.get('privateKey');
var publicKey = config_1.default.get('publicKey');
function signJwt(object, options) {
    return jsonwebtoken_1.default.sign({ id: object }, privateKey, __assign(__assign({}, (options && options)), { algorithm: 'RS256' }));
}
function verifyJwt(token) {
    try {
        var decoded = jsonwebtoken_1.default.verify(token, privateKey);
        return {
            valid: true,
            expired: false,
            decoded: decoded,
        };
    }
    catch (e) {
        return {
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null,
        };
    }
}
//# sourceMappingURL=jwt.utils.js.map
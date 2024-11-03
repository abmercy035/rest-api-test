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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserHandler = createUserHandler;
exports.getUserHandler = getUserHandler;
exports.getAllUserHandler = getAllUserHandler;
exports.updateUserHandler = updateUserHandler;
exports.deleteUserHandler = deleteUserHandler;
var user_service_1 = require("../service/user.service");
var auth_bcrypt_1 = require("../utils/auth.bcrypt");
var jwt_utils_1 = require("../utils/jwt.utils");
var cookieExtractor_1 = __importDefault(require("../utils/cookieExtractor"));
var logger_1 = __importDefault(require("../utils/logger"));
var lodash_1 = require("lodash");
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, password, rest, hashedPassword, user, token, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, password = _a.password, rest = __rest(_a, ["password"]);
                    return [4 /*yield*/, (0, auth_bcrypt_1.hashPassword)(password)];
                case 1:
                    hashedPassword = _b.sent();
                    return [4 /*yield*/, (0, user_service_1.createUser)(__assign(__assign({}, rest), { password: hashedPassword }))];
                case 2:
                    user = _b.sent();
                    token = (0, jwt_utils_1.signJwt)(user._id, { expiresIn: "1d" });
                    (0, logger_1.default)({ msg: "token:", token: token });
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                        path: "/",
                        maxAge: 78 * 60 * 60 * 1000 // 3 days
                    });
                    res.json(user);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    res.status(409).json({ err: { message: "user already exist with that email" } });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, password, email, userFound, isPasswordAMatch, token, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _a = req.body, password = _a.password, email = _a.email;
                    return [4 /*yield*/, (0, user_service_1.findUser)({ email: email })];
                case 1:
                    userFound = _b.sent();
                    if (!userFound) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, auth_bcrypt_1.comparePassword)(password, userFound.password)];
                case 2:
                    isPasswordAMatch = _b.sent();
                    if (isPasswordAMatch) {
                        token = (0, jwt_utils_1.signJwt)(userFound._id, { expiresIn: "1d" });
                        res.cookie('token', token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                            path: "/",
                            maxAge: 78 * 60 * 60 * 1000 // 3 days
                        });
                        res.json((0, lodash_1.omit)(userFound, ["password"]));
                        return [2 /*return*/];
                    }
                    else {
                        res.status(401).json({ err: { message: "password is incorrect" } });
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    res.status(401).json({ err: { message: "user not found" } });
                    return [2 /*return*/];
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_2 = _b.sent();
                    res.status(409).json({ err: { message: "user already exist with that email" } });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getAllUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var token, _a, valid, expired, decoded, userFound, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, (0, cookieExtractor_1.default)(req)];
                case 1:
                    token = _b.sent();
                    if (!token) return [3 /*break*/, 5];
                    _a = (0, jwt_utils_1.verifyJwt)(token.toString()), valid = _a.valid, expired = _a.expired, decoded = _a.decoded;
                    if (!(valid && !expired && decoded)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, user_service_1.findAllUser)()];
                case 2:
                    userFound = _b.sent();
                    res.json(userFound);
                    return [3 /*break*/, 4];
                case 3:
                    res.status(401).json({ err: { message: "session expired" } });
                    return [2 /*return*/];
                case 4: return [3 /*break*/, 6];
                case 5:
                    res.status(401).json({ err: { message: "You are not logged in" } });
                    return [2 /*return*/];
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_3 = _b.sent();
                    res.status(500).json({ err: { message: "something went wrong" } });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function updateUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var token, data, _a, valid, expired, decoded, userFound, token_1, updatedUser, e_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, cookieExtractor_1.default)(req)];
                case 1:
                    token = _b.sent();
                    data = req.body;
                    if (!token) return [3 /*break*/, 7];
                    _a = (0, jwt_utils_1.verifyJwt)(token), valid = _a.valid, expired = _a.expired, decoded = _a.decoded;
                    if (!(valid && !expired && decoded)) return [3 /*break*/, 6];
                    (0, logger_1.default)(decoded);
                    return [4 /*yield*/, (0, user_service_1.updateUser)({ _id: decoded.id, }, data)];
                case 2:
                    userFound = _b.sent();
                    if (!userFound) return [3 /*break*/, 4];
                    token_1 = (0, jwt_utils_1.signJwt)(userFound._id, { expiresIn: "1d" });
                    res.cookie('token', token_1, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                        path: "/",
                        maxAge: 78 * 60 * 60 * 1000 // 3 days
                    });
                    return [4 /*yield*/, (0, user_service_1.updateUser)(userFound._id, data)];
                case 3:
                    updatedUser = _b.sent();
                    res.json((0, lodash_1.omit)(updatedUser, ["password"]));
                    return [3 /*break*/, 5];
                case 4:
                    res.status(401).json({ err: { message: "user not found" } });
                    return [2 /*return*/];
                case 5: return [3 /*break*/, 7];
                case 6:
                    res.status(401).json({ err: { message: "Please login" } });
                    return [2 /*return*/];
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_4 = _b.sent();
                    res.status(409).json({ err: { message: "user already exist with that email" } });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function deleteUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var token, data, _a, valid, expired, decoded, userFound, token_2, updatedUser, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, cookieExtractor_1.default)(req)];
                case 1:
                    token = _b.sent();
                    data = req.body;
                    if (!token) return [3 /*break*/, 7];
                    _a = (0, jwt_utils_1.verifyJwt)(token), valid = _a.valid, expired = _a.expired, decoded = _a.decoded;
                    if (!(valid && !expired && decoded)) return [3 /*break*/, 6];
                    (0, logger_1.default)(decoded);
                    return [4 /*yield*/, (0, user_service_1.deleteUser)({ _id: decoded.id, })];
                case 2:
                    userFound = _b.sent();
                    if (!userFound) return [3 /*break*/, 4];
                    token_2 = (0, jwt_utils_1.signJwt)(userFound._id, { expiresIn: "1d" });
                    res.cookie('token', token_2, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                        path: "/",
                        maxAge: 78 * 60 * 60 * 1000 // 3 days
                    });
                    return [4 /*yield*/, (0, user_service_1.updateUser)(userFound._id, data)];
                case 3:
                    updatedUser = _b.sent();
                    res.json((0, lodash_1.omit)(updatedUser, ["password"]));
                    return [3 /*break*/, 5];
                case 4:
                    res.status(401).json({ err: { message: "user not found" } });
                    return [2 /*return*/];
                case 5: return [3 /*break*/, 7];
                case 6:
                    res.status(401).json({ err: { message: "Please login" } });
                    return [2 /*return*/];
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_5 = _b.sent();
                    res.status(409).json({ err: { message: "user already exist with that email" } });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=user.controller.js.map
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionHandler = createSessionHandler;
exports.getUserSessionsHandler = getUserSessionsHandler;
exports.deleteSessionHandler = deleteSessionHandler;
exports.reIssueAccessToken = reIssueAccessToken;
var config_1 = __importDefault(require("config"));
var sessions_model_1 = __importDefault(require("../model/sessions.model"));
var session_service_1 = require("../service/session.service");
var user_service_1 = require("../service/user.service");
var jwt_utils_1 = require("../utils/jwt.utils");
var lodash_1 = require("lodash");
function createSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var user, session, accessToken, refreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, user_service_1.validatePassword)(req.body)];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        res.status(401).send("Invalid email or password");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, session_service_1.createSession)(user._id.toString(), req.get("user-agent") || "")];
                case 2:
                    session = _a.sent();
                    accessToken = (0, jwt_utils_1.signJwt)(__assign(__assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("accessTokenTtl") } // 15 minutes
                    );
                    refreshToken = (0, jwt_utils_1.signJwt)(__assign(__assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("refreshTokenTtl") } // 1 year
                    );
                    // Send the tokens
                    res.send({ accessToken: accessToken, refreshToken: refreshToken });
                    return [2 /*return*/];
            }
        });
    });
}
function getUserSessionsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, sessions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, res.locals.user.id];
                case 1:
                    userId = _a.sent();
                    return [4 /*yield*/, (0, session_service_1.findSessions)({ user: userId, valid: true })];
                case 2:
                    sessions = _a.sent();
                    res.send(sessions);
                    return [2 /*return*/];
            }
        });
    });
}
function deleteSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = res.locals.user.session;
                    return [4 /*yield*/, (0, session_service_1.updateSession)({ _id: session }, { valid: false })];
                case 1:
                    _a.sent();
                    res.send({
                        accessToken: null,
                        refreshToken: null
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function reIssueAccessToken(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var decoded, session, user, accessToken;
        var refreshToken = _b.refreshToken;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    decoded = (0, jwt_utils_1.verifyJwt)(refreshToken).decoded;
                    if (!decoded || !(0, lodash_1.get)(decoded, "session"))
                        return [2 /*return*/, false];
                    return [4 /*yield*/, sessions_model_1.default.findById((0, lodash_1.get)(decoded, "session"))];
                case 1:
                    session = _c.sent();
                    // Make sure the session is still valid
                    if (!session || !session.valid)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, (0, user_service_1.findUser)({ _id: session.user })];
                case 2:
                    user = _c.sent();
                    // Create a new access token
                    if (!user)
                        return [2 /*return*/, false];
                    accessToken = (0, jwt_utils_1.signJwt)(__assign(__assign({}, user), { session: session._id }), { expiresIn: config_1.default.get("accessTokenTtl") } // 15 minutes
                    );
                    return [2 /*return*/, accessToken];
            }
        });
    });
}
//# sourceMappingURL=session.controller.js.map
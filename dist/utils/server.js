"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./../routes"));
var desializeUser_1 = __importDefault(require("../middleware/desializeUser"));
function createServer() {
    var app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(desializeUser_1.default);
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Refresh, Content-Type, Accept, Authorization");
        res.header('Access-Control-Allow-Credentials', "true");
        next();
    });
    (0, routes_1.default)(app);
    return app;
}
exports.default = createServer;
//# sourceMappingURL=server.js.map
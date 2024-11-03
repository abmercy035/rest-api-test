"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_controller_1 = require("./controller/user.controller");
var validateResource_1 = __importDefault(require("./middleware/validateResource"));
var user_schema_1 = require("./schema/user.schema");
function routes(app) {
    app.get('/healthcheck', function (req, res) {
        res.status(200).send("app is healthy");
    });
    app.post("/api/users", (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
    app.get("/api/user", user_controller_1.getUserHandler);
    app.get("/api/users", user_controller_1.getAllUserHandler);
    app.put("/api/user", user_controller_1.updateUserHandler);
    app.delete("/api/user", user_controller_1.deleteUserHandler);
}
exports.default = routes;
//# sourceMappingURL=routes.js.map
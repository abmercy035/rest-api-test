"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
var zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email is required"
        }).email("Not a valid email"),
        password: (0, zod_1.string)({
            required_error: "Password is required"
        }).min(8, "Password should be at least 8 characters long"),
        first_name: (0, zod_1.string)({
            required_error: "First name is required"
        }),
        last_name: (0, zod_1.string)({
            required_error: "Last name is required"
        }),
        middle_name: (0, zod_1.string)({
            required_error: "Middle name is required"
        })
    })
});
//# sourceMappingURL=user.schema.js.map
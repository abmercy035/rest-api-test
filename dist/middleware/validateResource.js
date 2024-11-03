"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validateResource = function (schema) { return function (req, res, next) {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
        return;
    }
    catch (e) {
        res.status(400).send(e.message);
        return;
    }
}; };
exports.default = validateResource;
//# sourceMappingURL=validateResource.js.map
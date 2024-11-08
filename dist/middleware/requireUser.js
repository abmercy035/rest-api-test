"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireUser = function (req, res, next) {
    var user = res.locals.user;
    if (!user) {
        res.sendStatus(403);
        return;
    }
    next();
};
exports.default = requireUser;
//# sourceMappingURL=requireUser.js.map
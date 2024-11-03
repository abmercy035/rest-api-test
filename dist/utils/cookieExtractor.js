"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookieExtractor = function (req) {
    var _a, _b;
    var appCookies = ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.cookie) === null || _b === void 0 ? void 0 : _b.split(";"));
    var cname = "token";
    if (appCookies)
        for (var _i = 0, appCookies_1 = appCookies; _i < appCookies_1.length; _i++) {
            var item = appCookies_1[_i];
            if (item.trim().startsWith("".concat(cname, "="))) {
                return (item.trim().substr(cname.length + 1));
            }
        }
    return null;
};
exports.default = cookieExtractor;
//# sourceMappingURL=cookieExtractor.js.map
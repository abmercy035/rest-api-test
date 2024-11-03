"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = log;
function log(message) {
    var error = new Error();
    var stack = error.stack;
    if (!stack) {
        console.log(message, "(unknown location)");
        return;
    }
    var stackLines = stack.split('\n');
    if (stackLines) {
        var fileNameAndLineNumber = stackLines[2].slice(stackLines[2].lastIndexOf("".concat("\\")) + 1, stackLines[2].length);
        console.log("ts:logger:", message, "(".concat(fileNameAndLineNumber, ")"));
    }
    else {
        console.log(message, "file unkn");
    }
}
//# sourceMappingURL=logger.js.map
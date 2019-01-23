"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function now() {
    if (Date.now) {
        return Date.now();
    }
    return new Date().getTime();
}
exports.default = now;
//# sourceMappingURL=now.js.map
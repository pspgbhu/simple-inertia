"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var now_1 = require("../utils/now");
var FRICTION_RATIO = 0.3;
var Inertia = /** @class */ (function () {
    function Inertia() {
        this.lastTime = null;
        this.lastValue = null;
        this.speed = 0;
        this.stopFlag = false;
    }
    Inertia.prototype.move = function (opt) {
        var value = null;
        var diff = null;
        if (typeof opt === 'number') {
            value = opt;
        }
        if (typeof opt === 'object') {
            value = opt.value;
            diff = opt.diff;
        }
        this.stopFlag = false;
        // 第一次 move 的时候，只有一个点，所以无法算出速度。
        if (this.lastTime === null || this.lastValue === null) {
            this.lastTime = now_1.default();
            this.lastValue = value;
            return;
        }
        var nowTime = now_1.default();
        diff = typeof diff === 'number'
            ? diff
            : value - this.lastValue;
        // v = d / t
        this.speed = diff / (nowTime - this.lastTime);
        this.lastValue = value;
        this.lastTime = nowTime;
    };
    Inertia.prototype.loose = function (opt, fn) {
        var _this = this;
        var options = {};
        var cb = null;
        if (typeof opt === 'function') {
            cb = opt;
        }
        else if (typeof opt === 'object') {
            options = opt;
            if (typeof fn === 'function') {
                cb = fn;
            }
        }
        var _a = options.frictionRatio, frictionRatio = _a === void 0 ? FRICTION_RATIO : _a, _b = options.interval, interval = _b === void 0 ? 'requestAnimationFrame' : _b, _c = options.minDecrease, minDecrease = _c === void 0 ? 1 : _c;
        if (interval === 'requestAnimationFrame') {
            var beforeTime_1 = now_1.default();
            window.requestAnimationFrame(function () {
                var afterTime = now_1.default();
                var costTime = afterTime - beforeTime_1;
                var diff = _this.toFriction(costTime, frictionRatio, minDecrease);
                if (typeof cb === 'function') {
                    cb({
                        diff: diff,
                        value: _this.lastValue,
                    });
                }
                if (_this.speed !== 0 && !_this.stopFlag) {
                    _this.loose({ frictionRatio: frictionRatio, interval: interval, minDecrease: minDecrease }, cb);
                }
            });
            return this;
        }
        if (typeof interval === 'number') {
            setTimeout(function () {
                var diff = _this.toFriction(interval, frictionRatio, minDecrease);
                if (typeof cb === 'function') {
                    cb({ diff: diff, value: _this.lastValue });
                }
                if (_this.speed !== 0 && !_this.stopFlag) {
                    _this.loose({ frictionRatio: frictionRatio, interval: interval, minDecrease: minDecrease }, cb);
                }
            }, interval);
        }
        return this;
    };
    Inertia.prototype.stop = function () {
        this.stopFlag = true;
    };
    Inertia.prototype.toFriction = function (interval, frictionRatio, minDecrease) {
        var friction = (1 - frictionRatio) > 0 ? (1 - frictionRatio) : 0;
        var speed = this.speed * friction;
        var diff = speed * interval;
        var value = this.lastValue + diff;
        // 认为已经滑不动了
        if (Math.abs(diff) < minDecrease) {
            speed = 0;
        }
        this.lastValue = value;
        this.speed = speed;
        return diff;
    };
    Inertia.prototype.sameSign = function (number1, number2) {
        if (number1 >= 0) {
            if (number2 >= 0) {
                return true;
            }
            return false;
        }
        if (number1 < 0) {
            if (number2 < 0) {
                return true;
            }
            return false;
        }
    };
    return Inertia;
}());
exports.default = Inertia;
//# sourceMappingURL=Inertia.js.map
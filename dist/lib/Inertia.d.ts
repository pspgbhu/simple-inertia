interface ILooseValue {
    value: number;
    diff: number;
}
export default class Inertia {
    private lastTime;
    private lastValue;
    private speed;
    private stopFlag;
    move(opt: number | {
        value?: number;
        diff?: number;
    }): void;
    loose(fn?: (value: ILooseValue) => void): this;
    loose(opt?: {
        frictionRatio?: number;
        minDecrease?: number;
        interval?: 'requestAnimationFrame' | number;
    }, fn?: (value: ILooseValue) => void): this;
    stop(): void;
    private toFriction;
    private sameSign;
}
export {};

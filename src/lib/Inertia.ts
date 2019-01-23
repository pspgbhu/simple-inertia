import now from '../utils/now';

interface ILooseValue {
  value: number;
  diff: number;
}

const FRICTION_RATIO = 0.15;

export default class Inertia {
  private lastTime: number = null;

  private lastValue: number = null;

  private speed: number = 0;

  public move(opt: number | { value?: number; diff?: number }): void {
    let value: number = null;
    let diff: number = null;

    if (typeof opt === 'number') {
      value = opt;
    }
    if (typeof opt === 'object') {
      value = opt.value;
      diff = opt.diff;
    }

    // 第一次 move 的时候，只有一个点，所以无法算出速度。
    if (this.lastTime === null || this.lastValue === null) {
      this.lastTime = now();
      this.lastValue = value;
      return;
    }

    const nowTime = now();

    diff = typeof diff === 'number'
      ? diff
      : value - this.lastValue;

    // v = d / t
    this.speed = diff / (nowTime - this.lastTime);

    this.lastValue = value;
    this.lastTime = nowTime;
  }

  public loose(fn?: (value: ILooseValue) => void): this;
  public loose(
    opt?: {
      frictionRatio?: number,  // decrease 100 pre second.
      minDecrease?: number,
      interval?: 'requestAnimationFrame' | number,
    },
    fn?: (value: ILooseValue) => void,
  ): this;
  public loose(
    opt?: {
      frictionRatio?: number,  // decrease 100 pre second.
      minDecrease?: number,
      interval?: 'requestAnimationFrame' | number,
    } | typeof fn,
    fn?: (value: ILooseValue) => void,
  ) {
    let options: typeof opt = {};
    let cb: typeof fn = null;

    if (typeof opt === 'function') {
      cb = opt;
    } else if (typeof opt === 'object') {
      options = opt;
      if (typeof fn === 'function') {
        cb = fn;
      }
    }

    const {
      frictionRatio = FRICTION_RATIO,
      interval = 'requestAnimationFrame',
      minDecrease = 1,
    } = options;

    if (interval === 'requestAnimationFrame') {
      const beforeTime = now();

      window.requestAnimationFrame(() => {
        const afterTime = now();
        const costTime = afterTime - beforeTime;

        const diff = this.toFriction(costTime, frictionRatio, minDecrease);

        if (typeof cb === 'function') {
          cb({
            diff,
            value: this.lastValue,
          });
        }

        if (this.speed !== 0) {
          this.loose({ frictionRatio, interval, minDecrease }, cb);
        }
      });

      return this;
    }

    if (typeof interval === 'number') {
      setTimeout(() => {
        const diff = this.toFriction(interval, frictionRatio, minDecrease);

        if (typeof cb === 'function') {
          cb({ diff, value: this.lastValue });
        }

        if (this.speed !== 0) {
          this.loose({ frictionRatio, interval, minDecrease }, cb);
        }
      }, interval);
    }

    return this;
  }

  public stop() {
    this.speed = 0;
  }

  private toFriction(
    interval: number,
    frictionRatio: number,
    minDecrease: number,
  ): number {
    const friction = (1 - frictionRatio) > 0 ? (1 - frictionRatio) : 0;
    let speed = this.speed * friction;
    const diff = speed * interval;
    const value = this.lastValue + diff;

    // 认为已经滑不动了
    if (Math.abs(diff) < minDecrease) {
      speed = 0;
    }

    this.lastValue = value;
    this.speed = speed;

    return diff;
  }

  private sameSign(number1: number, number2: number): boolean {
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
  }
}

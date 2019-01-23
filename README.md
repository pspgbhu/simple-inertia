# sample-inertia

一个简单的惯性库

## Usage

```js
import Inertia from 'sample-inertia';

const inertia = new Inertia();

let times = 0
let distance = 0

// 开始主动滑动物体
const timer = setInterval(() => {
    distance += 20;
    times += 1;

    inertia.move(distance);

    if (times >= 100) {
        clearInterval(timer);
        slide();
    }
}, 1000 / 60);

// 依靠惯性继续滑动
function slide() {
    inertia.loose(({ value, diff }) => {
        console.log(value, diff);
    })
}
```
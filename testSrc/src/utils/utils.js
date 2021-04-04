/**
 *Author: erin
 *DateTime: 2021/3/7 9:06 下午
 */
export default {
    setPageTitle(title) {
        document.title = title || $lux.config.siteName
    },
    // let resize = this.debounce(()=>{
    //
    // }, 200)
    // https://blog.csdn.net/qq_18901079/article/details/96630725
    debounce: function (fn, delay) {
        let timer;
        delay = delay || 300;
        return function () {
            let th = this, args = arguments;
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                timer = null;
                fn.apply(th, args);
            }, delay);
        };
    },
    throttle: function (fn, interval) {
        let last, timer;
        interval = interval || 200;
        return function () {
            let th = this, args = arguments, now = +new Date();
            if (last && now - last < interval) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    last = now;
                    fn.apply(th, args);
                }, interval);
            } else {
                last = now;
                fn.apply(th, args);
            }
        }
    },
}

/**
 *Author: erin
 *DateTime: 2021/1/24 5:54 下午
 */
module.exports = {
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        //以上的ip和端口是我们本机的;下面为需要跨域的
        proxy: {//配置跨域
            '/api': {
                target: 'https://developer.amap.com/api/',
                //这里后台的地址模拟的;应该填写你们真实的后台接口
                ws: true,
                changOrigin: true,//允许跨域
                pathRewrite: {
                    '^/api/javascript-api/guide/abc/plugins': ''//请求的时候使用这个api就可以
                }
            }

        }
    }
}

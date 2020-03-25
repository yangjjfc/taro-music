import Fly from 'flyio/dist/npm/wx';
import { Headers, Method } from './index.d';
import Interceptor from './interceptor';

const fly = new Fly();
const TimeOut = 15000;
// 初始化拦截器
new Interceptor({ TimeOut, fly }); // eslint-disable-line no-new
// 配置
const configuration = [
    'version', // 版本
    'ignoreRepeat', // 忽略防止重复请求
    'verifycode' // 验证码
];
/**
 * 基础配置
 * @param {*} url  请求地址
 * @param {*} data  参数
 * @param {*} type  请求类型,默认post
 */
const Http = async (url: string, data: any = {}, type: Method = 'get') => {
    const headers: Headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    };
    let response: any;
    // 处理配置
    for (const item of configuration) {
        if (data[item]) {
            headers[item] = data[item];
            delete data[item];
        }
    }
    const config = {
        method: type,
        timeout: TimeOut, // 超时时间
        headers: headers,
        parseJson: true,
        withCredentials: false
    };
    try {
        response = await fly.request(url, data, config);
    } catch (error) {
        response = Promise.reject(error);
    }
    return response;
};

export default Http;

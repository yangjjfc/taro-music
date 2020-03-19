import axios from 'axios';
import { Headers,Method,ResponseType } from './index.d'
import { Environment } from '@/utils/config/index';
import Interceptor from './interceptor';


const TimeOut: number = 15000;
// 初始化拦截器
new Interceptor({ TimeOut, axios }); // eslint-disable-line no-new
// 配置
const configuration = [
    'version', // 版本
    'ignoreRepeat', // 忽略防止重复请求
    'verifycode' // 验证码
];

/**
 * 基础配置
 * 更多配置请参考 https://github.com/axios/axios
 * @param {*} url  请求地址
 * @param {*} data  参数
 * @param {*} type  请求类型,默认post
 */
const Http = (url:string, data:any = {}, type:Method = 'post') => {
    const headers: Headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    };
    // 添加header token
    const token = Environment.TOKEN;
    let query: string; 
    let responseType: ResponseType = 'json';
    let response: any;
    // 处理配置
    for (const item of configuration) {
        if (data[item]) {
            headers[item] = data[item];
            delete data[item];
        }
    }
    if (url.split('.').length === 1 || ~url.indexOf('.json') || type === 'get') {
        query = url;
    } else {
        query = 'call?apiCode=' + url + '&jtoken=' + token + '&apiVersion=' + (headers.version || '');
    }
    const config = {
        url: query,
        method: type,
        data: data,
        timeout: TimeOut, // 超时时间
        headers: headers,
        responseType: responseType,
        validateStatus: function (status:number) {
            return status >= 200 && status < 300; // 默认的
        },
        maxRedirects: 5
    };
    try {
        response = axios(config);
    } catch (error) {
        response = Promise.reject(error);
    }
    return response;
};

export default Http;

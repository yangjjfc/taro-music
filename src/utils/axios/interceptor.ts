/**
 * fly interceptor 拦截器配置
 */
import { showModal } from '../modal/index.js';
import { Environment } from '@/utils/config/index';

class Interceptor {
    private fly: any;
    private req: any;
    constructor({ TimeOut, fly }) {
        this.fly = fly;
        this.req = {
            timeout: TimeOut
        }; // 防止同个链接连续请求
        this.request();
        this.response();
    }

    requestTimeout(name) {
        setTimeout(() => {
            if (this.req[name]) {
                delete this.req[name];
            }
        }, this.req.timeout);
    }

    // 对请求数据做些什么
    request() {
        this.fly.interceptors.request.use((request) => {
            request.urlGuid = request.url; // 防止同个链接连续请求
            // 本地
            if (~request.url.indexOf('.json')) {
                request.method = 'GET';
                request.url = '/data/' + request.url;
                // 线上
            } else if (request.headers.ignoreRepeat || !this.req[request.urlGuid]) {
                request.url = Environment.REQUEST_URL + request.url;
                this.req[request.urlGuid] = true;
                this.requestTimeout(request.urlGuid);
            } else if (this.req[request.urlGuid]) {
                return Promise.reject('重复请求' + request.url);
            }
            return request;
        }, (error) => Promise.reject(error));
    }

    // 对响应数据做点什么
    response() {
        this.fly.interceptors.response.use((response) => {
            delete this.req[response.request.urlGuid]; // 防止同个链接连续请求
            if (response.data) {
                if (response.data.code === 200) {
                    return response.data;
                }
                showModal({
                    content: `${response.data.message}`,
                    showCancel: false
                });
                return Promise.reject(response);
            }
            return response;
        }, (error) => {
            return Promise.reject(error);
        });
    }

    formatResponseData(response) {
        let responsex = {}, apiCode = response.config.url;
        if (response.config.url.includes('apiCode')) {
            apiCode = response.config.url.split('apiCode')[1];
            if (apiCode) {
                apiCode = apiCode.split('&')[0].replace(/=/g, '');
            }
        }
        try {
            responsex = {
                api: apiCode,
                req: JSON.parse(response.config.data || {}),
                res: response.data
            };
        } catch (error) {
            responsex = {};
        }
        return responsex;
    }
}
export default Interceptor;
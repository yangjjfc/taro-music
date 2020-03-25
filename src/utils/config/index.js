/*
 * @Author: yangjj
 * @Date: 2019-06-24 09:08:18
 * @LastEditors: yangjj
 * @LastEditTime: 2020-03-25 08:45:53
 * @Description: 全局环境配置文件,使用时必须是import,而不能require
 */

 
export let Environment = {
    REQUEST_URL: 'http://localhost:3000', // 请求地址
    IMAGE_DOWNLOAD: 'http://dfs.test.cloudyigou.com/dfs/', // 图片下载服务器地址
    IMG_SIZE_MAX: '5242880',
    SENTRY_DSN: '', // sentry的dsn
    USER_SENTRY: false, // sentry的开关
    NODE_ENV: 'development', // 开发环境,区分本地线上
    USER_ENVIRONMENT: 'dev', // 环境
    RELEASE: '1.1', // 版本
    APPID: 'wx55bba9834bde7666', // 微信测试id,上线需替换
    TOKEN: 'bf2eaddec21131f564166e58494d899' // 用户登入凭证
};

if (process.env.NODE_ENV === 'production') {
    Environment = {
        ...Environment, 
        ...{
            IMAGE_DOWNLOAD: 'http://dfs.dev.cloudyigou.com/dfs/'
        }
    };
}

export const changeEnvironment = (obj) => {
    Environment = { ...Environment, ...obj };
};

import Taro from '@tarojs/taro';

export const showModal = (opt) => new Promise((resolve, reject) => {
    const _json = {
        title: '提示',
        success: function (res) {
            if (res.confirm) {
                resolve();
            } else if (res.cancel) {
                reject();
            }
        },
        fail: function () {
            reject();
        }
    };
    opt = {..._json, ...opt};
    Taro.showModal(opt);
});
import Taro from '@tarojs/taro';

// 获取store
export const getStorageSync = (key: string) => {
    let value = Taro.getStorageSync(key) || null;
    return JSON.parse(value);
}

//存储store
export const setStorageSync = (key: string, value: object) => {
    let setVal = JSON.stringify(value);
    Taro.setStorageSync(key,setVal);
}

//清除store
export const clearStorageSync = () => {
    Taro.clearStorageSync();
}


//简单深拷贝
export const deepClone = (data:{}={}) => {
    return JSON.parse(JSON.stringify(data));
}
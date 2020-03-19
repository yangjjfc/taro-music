import $http from '@/utils/axios/index';
import * as ActionType from '../action-types';

/**
 * reducers
 */
const defaultState = {
    menu: [],
    button: []
};
const permission = (state = defaultState, action) => {
    switch (action.type) {
    case ActionType.USER_MENU:
        return { ...state, ...{ menu: action.msg } };
    case ActionType.USER_BUTTON_PERMISSION:
        return { ...state, ...{ button: action.msg } };
    default:
        return state;
    }
};

export default permission;






/**
 * actios
 */
export const setMenu = msg => ({
    msg,
    type: ActionType.USER_MENU
});
export const setButton = msg => ({
    msg,
    type: ActionType.USER_BUTTON_PERMISSION
});
const filterMenu = meun =>
    meun.filter(item => {
        if (item.children && item.children.length) {
            item.children = filterMenu(item.children);
        }
        return item.funcType === 'MENU';
    });
// 获取权限
export const getPermission = () => async (dispatch, getState) => {
    const { permission } = getState();
    if (permission.menu.length) {
        return permission;
    } else {
        const res = await $http('brp.user.getCurrentUserMenuRights');
        if (res.data) {
            dispatch(setMenu(filterMenu(res.data.menuTree)));
            dispatch(setButton(res.data.permissionList));
            return res.data;
        }
    }
};
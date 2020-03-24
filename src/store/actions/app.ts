import * as ActionType from '../action-types';

/**
 * reducers
 */
const defaultState = {
    collapsed: false, // false,展开 true,缩起
    device: 'desktop',
    $path: {}// href信息
};

export default (state = defaultState, action) => {
    switch (action.type) {
    case ActionType.USER_EXPANSION:
        return { ...state, ...{ collapsed: action.msg } };
    case  ActionType.USER_DEVICE:
        return { ...state, ...{ device: action.msg } };
    case ActionType.USER_PATHNAME:
        return { ...state, ...{ $path: action.msg } };
    default:
        return state;
    }
};


/**
 * actios
 */
// 终端设备
export const toggleDevice = msg => ({
    msg,
    type: ActionType.USER_DEVICE
});
export const setPathName = msg => ({
    msg,
    type: ActionType.USER_PATHNAME
});
// 是否展开菜单
export const toggleExpansion = () => (dispatch, getState) => {
    const collapsed = getState().app.collapsed;
    dispatch({
        msg: !collapsed,
        type: ActionType.USER_EXPANSION
    });
};
// 关闭菜单
export const closeSideBar = () => ({
    msg: true,
    type: ActionType.USER_EXPANSION
});

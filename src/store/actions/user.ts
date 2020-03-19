import $http from '@/utils/axios/index';
import * as ActionType from '../action-types';

/**
 * reducers
 */
export default (state = {}, action) => {
    switch (action.type) {
    case ActionType.USER_INFO:
        return { ...action.msg };
    default:
        return state;
    }
};



/**
 * actios
 */
export const setUser = msg => ({
    msg,
    type: ActionType.USER_INFO
});


export const getUser = () => async (dispatch, getState) => {
    const { user } = getState();
    if (!user.enterpriseNo) {
        const res = await $http('currentUser', {});
        dispatch(setUser(res.data));
        return res.data;
    } else {
        return user;
    }
};
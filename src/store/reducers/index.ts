import { combineReducers } from 'redux';
import {default as user }  from '../actions/user';
import {default as permission } from '../actions/permission';
import {default as app } from '../actions/app';


const rootReducer = combineReducers({
    user,
    permission,
    app
});

export default rootReducer;

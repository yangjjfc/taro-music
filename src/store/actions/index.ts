import * as user from './user';
import * as permission from './permission';
import * as app from './app';


export default  {
    ...user,
    ...permission,
    ...app
};
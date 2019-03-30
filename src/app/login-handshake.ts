import { Token } from './moodle/token';
import { UserInfo } from './moodle/user-info';

export class LoginHandshake {
    token:Token;
    user_info: UserInfo;
    main_site?:String;
}

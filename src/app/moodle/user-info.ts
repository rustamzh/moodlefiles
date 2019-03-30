export type UserInfoDummy = {fullname: String, userpictureurl: String, userid: Number}

export class UserInfo {
    fullName: String;
    avatarUrl: String;
    id: Number;
    
    constructor({fullname, userpictureurl, userid}: UserInfoDummy){
        this.fullName = fullname;
        this.avatarUrl = userpictureurl;
        this.id = userid;
    }
}

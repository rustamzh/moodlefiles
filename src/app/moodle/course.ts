export type CourseDummy = {id:Number, fullname: String};
export class Course {
    id: Number;
    fullName: String;

    constructor({id, fullname} : CourseDummy){
        this.id = id;
        this.fullName = fullname;
    }
}

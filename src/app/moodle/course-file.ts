export type CourseFileDummy = {filesize: Number, fileurl: String, filename: String, mimetype: String}
export class CourseFile {
    fileSize: Number;
    url: String;
    fileName: String;
    mime: String;

    constructor({filesize, fileurl, filename, mimetype}: CourseFileDummy){
        this.fileName = filename;
        this.url = fileurl;
        this.fileSize = filesize;
        this.mime = mimetype;
    }
}

import { CourseFile } from './moodle/course-file';

export class CourseFileWithSpinner{
    spinner?;
    file: CourseFile
    constructor(file:CourseFile, spinner){
        this.file = file;
        this.spinner = spinner
    }
}

import { Course } from './moodle/course';

export class CourseWithSpinner {
    index;
    course:Course;

    constructor(course, index) {
        this.course = course;
        this.index = index;
    }
}

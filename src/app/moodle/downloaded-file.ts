import { CourseFile } from './course-file';

export interface DownloadedFile {
    blob: Blob,
    courseFile: CourseFile
}

import { Component, OnInit} from '@angular/core';
import { LoginHandshake } from '../login-handshake';
import { LocalStorage, LocalStorageService } from 'ngx-store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MoodleFileService } from '../moodle/moodle-file.service';
import { Course } from '../moodle/course';
import { CourseFile } from '../moodle/course-file';
import { Cacheable } from 'ngx-cacheable';
import { mergeMap, map, tap } from 'rxjs/operators';
import * as saveAs from 'file-saver';
import * as JSZip from 'jszip';
import { DownloadedFile } from '../moodle/downloaded-file';
import { CourseFileWithSpinner } from '../course-file-with-spinner';
import { CourseWithSpinner } from '../course-with-spinner';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Observable<CourseWithSpinner[]>;
  spinnerMap = []

  @LocalStorage()
  userInfo: LoginHandshake;
  
  columnsToDisplay = ['courseName', 'courseAction'];
  constructor(private authService:MoodleFileService, private router: Router, private localStorageService: LocalStorageService) { }

  @Cacheable({
      async: false,
      maxCacheCount: 100
  })
  getCourseFiles(course: Course): Observable<CourseFileWithSpinner[]> {

    return this.authService.getCourseFilesList(this.userInfo.main_site, this.userInfo.token, course)
      .pipe(map((files:CourseFile[]) => files.map(file=>{
        let index = this.spinnerMap.length
        this.spinnerMap.push({isRequest: false, progress: 0})
        return new CourseFileWithSpinner(file, index)
      })));
  }

  logout() {
    this.localStorageService.clear('decorators');
    this.router.navigate(['/login']);
  }

  downloadFile(file: CourseFileWithSpinner) {
    //init spinner
    this.spinnerMap[file.spinner].isRequest = true;
    // this.authService.downloadFile(file.file, this.userInfo.token).subscribe( (result: DownloadedFile) => {
    //     saveAs.saveAs(result.blob, result.courseFile.fileName.toString())
    // })
    this.authService.downloadFileWithProgress(file.file, this.userInfo.token).subscribe( (result: Number | DownloadedFile) => {
        if (result instanceof Number || typeof result === "number") {
            this.spinnerMap[file.spinner].progress = result;
        } else {
            saveAs.saveAs(result.blob, result.courseFile.fileName.toString());
            // this.spinnerMap[file.spinner].isRequest = false;
        }
    })
  }

  downloadCourse(course: CourseWithSpinner) {
      
    this.spinnerMap[course.index].isRequest = true;
    this.getCourseFiles(course.course).pipe(mergeMap(((courseFiles: CourseFileWithSpinner[]) => {
        return this.authService.downloadFilesWithProgress(courseFiles.map(file=>file.file), this.userInfo.token)
    }))).pipe(tap(x=>console.log(x))).subscribe((zip:JSZip| Number) => {
        if (zip instanceof Number || typeof zip === "number") {
            this.spinnerMap[course.index].progress = zip;
        } else {
        zip.generateAsync({type:"blob"}).then((content) => {
            saveAs.saveAs(content, `${course.course.fullName.substring(0, 100)}.zip`);
            // this.spinnerMap[course.index].isRequest = false;
        });
        }
    });
  }

  ngOnInit() {
    if (!this.userInfo.token || !this.userInfo.main_site) {
        this.router.navigate(['/login']);
        return;
    }
    console.log(this.userInfo);
    this.courses = this.authService.getCourses(this.userInfo.main_site, this.userInfo.token, this.userInfo.user_info)
        .pipe(map(courses=> courses.map(course => {
            let index = this.spinnerMap.length
            this.spinnerMap.push({isRequest: false, progress: 0})
            return new CourseWithSpinner(course, index)
        })));
  }
}

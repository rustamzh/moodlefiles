import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse, HttpHeaderResponse } from '@angular/common/http';
import { Observable, of, from, BehaviorSubject } from 'rxjs';
import { map, tap, merge, mergeMap, mergeAll, bufferCount, concatAll, last, zipAll, zip, scan, concatMap } from 'rxjs/operators';
import { Token } from './token';
import { UserInfo, UserInfoDummy } from './user-info';
import { CourseDummy, Course } from './course';
import { CourseFile, CourseFileDummy } from './course-file';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { DownloadedFile } from './downloaded-file';

@Injectable({
  providedIn: 'root'
})
export class MoodleFileService {

  constructor(private http: HttpClient) { }

  login(website: String, username:String, password:String):Observable<Token> {
    return this.http.get(`${website}/login/token.php?username=${username}&password=${password}&service=moodle_mobile_app`, {responseType: 'text'})
    .pipe(map((data: String)=> {
      return JSON.parse(data.substring(data.indexOf("{"), data.lastIndexOf("}")+1));
    }))
  }

  getUserInfo(website: String, token: Token): Observable<UserInfo>{
    return this.http.get(`${website}/webservice/rest/server.php?wstoken=${token.token}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`)
    .pipe(map((data:UserInfoDummy) => {
      return new UserInfo(data);
    }))
  }

  getCourses(website: String, token: Token, user: UserInfo):Observable<Course[]> {
    return this.http.get(`${website}/webservice/rest/server.php?wstoken=${token.token}&wsfunction=core_enrol_get_users_courses&moodlewsrestformat=json&userid=${user.id}`)
    .pipe(map((data: CourseDummy[]) => {
      return data.map(courseDummy => new Course(courseDummy));
    }))
  }

  getCourseFilesList(website: String, token: Token, course: Course):Observable<CourseFile[]> {
    return this.http.get(`${website}/webservice/rest/server.php?wstoken=${token.token}&wsfunction=core_course_get_contents&moodlewsrestformat=json&courseid=${course.id}`)
    .pipe(tap(data => console.log(data)))
    .pipe(mergeMap((data:any[]) => {
      let courseFiles:CourseFile[] = []
      for (let i = 0; i < data.length; i++) {
        let modules = data[i].modules;
        for (let j = 0; j < modules.length; j++) {
            if (modules[j].contents && modules[j].contents.length > 0) {
                let contents = modules[j].contents;
                for (let k = 0; k < contents.length; k++) {
                  if (contents[k].type === "file")
                    courseFiles.push(new CourseFile(<CourseFileDummy>contents[k]))
                }
            }
        }
      }
      return of(courseFiles)
    }));
  }

  downloadFile(file: CourseFile, token: Token): Observable<DownloadedFile>{
    let url = file.url.indexOf('?') < 0 ? (file.url + "?token=" + token.token) : file.url + "&token=" + token.token;
    return this.http.get(url, {responseType: 'blob'})
    .pipe(map(data => ({courseFile: file, blob: data})))
  }

  downloadFileWithProgress(file: CourseFile, token: Token): Observable<DownloadedFile | Number>{
    let url = file.url.indexOf('?') < 0 ? (file.url + "?token=" + token.token) : file.url + "&token=" + token.token;
    let req = new HttpRequest("GET",url, {responseType: 'blob', reportProgress:true });
    return this.http.request(req)
    .pipe(
      map((event) => this.getEventMessage(event, file))
    ).pipe( map( (data: Number | Blob) => {
        if (data instanceof Blob) {
          return {courseFile: file, blob: data};
        } 
        return data;
      }
    ));
    }


  downloadFiles(files: CourseFile[], token: Token):Observable<JSZip> {
    return from(files.map(file=> this.downloadFile(file, token))).pipe(mergeAll()).pipe(bufferCount(files.length))
    .pipe(map((files: DownloadedFile[]) => {
      let zip = new JSZip();
      for (let i=0; i<files.length; i++){
        zip.file(files[i].courseFile.fileName.toString(), new Blob([files[i].blob], { type: 'application/octet-stream' }), {binary:true});
      }
      return zip;
    }))
  }

  downloadFilesWithProgress(files: CourseFile[], token: Token):Observable<JSZip | Number> {
    let currentProgress = new BehaviorSubject<number>(0);
    let current = 0;
    let fileDownload:Observable<JSZip> = from(files.map(file=> this.downloadFile(file, token))).pipe(concatMap(x=>{
      current++;
      console.log(`Current progress: ${current} Total: ${files.length} Percent: ${current/files.length*100}`)
      currentProgress.next(current/files.length*100);
      return x;
    })).pipe(bufferCount(files.length))
    .pipe(map((files: DownloadedFile[]) => {
      let zip = new JSZip();
      for (let i=0; i<files.length; i++){
        zip.file(files[i].courseFile.fileName.toString(), new Blob([files[i].blob], { type: 'application/octet-stream' }), {binary:true});
      }
      return zip;
    }))
    
    return fileDownload.pipe(merge(currentProgress))
  }

  private sizeOf(files: CourseFile[]): number {
    return files.map(file=> file.fileSize).reduce((acc, current) => acc.valueOf()+current.valueOf()).valueOf()
  }
 
  private log(){
    return tap(data => console.log(data))
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: CourseFile) {
    if (event instanceof HttpHeaderResponse) {
      return 100
    } else if (event instanceof HttpResponse) {
      return event.body
    }
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return percentDone;
      default:
        return 100;
    }
  }
}
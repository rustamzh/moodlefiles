import { Component, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MoodleFileService } from '../moodle/moodle-file.service';
import { LoginHandshake } from '../login-handshake';
import { LoginDetails } from '../login-details';
import { concatMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { PrivacyNoticeComponent } from '../privacy-notice/privacy-notice.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
}) 
export class LoginComponent implements OnInit {


  loginForm:FormGroup;

  loginDetails: LoginDetails = new LoginDetails();
  isRequest: Boolean = false;

  error: String;

  @LocalStorage()
  userInfo:LoginHandshake;

  constructor(private authService:MoodleFileService, private fb: FormBuilder, private router:Router, private dialog: MatDialog) { }

  openDialog() {
    this.dialog.open(PrivacyNoticeComponent);
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      main_site: ['https://moodle.nu.edu.kz', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.userInfo){
      console.log(this.userInfo);
      console.log(`I remember you, ${this.userInfo.user_info.fullName}`);
      console.log(`You are from ${this.userInfo.main_site}`);
      this.router.navigate(['/courses']);
    }
  }

  onFill():void {
    this.loginDetails = {
        main_site: this.loginForm.get("main_site").value,
        login: this.loginForm.get('login').value,
        password: this.loginForm.get('password').value
    };
    this.isRequest = true;
    console.log("clicked");
    console.log(this.loginDetails);
    let handshake = new LoginHandshake();
    handshake.main_site = this.loginDetails.main_site;
    
    this.authService.login(this.loginDetails.main_site, this.loginDetails.login, this.loginDetails.password)
    
    .pipe(concatMap((token => {
      
      handshake.token = token;
      return this.authService.getUserInfo(this.loginDetails.main_site,token);
    })))

    .subscribe((userInfo) => {
      this.isRequest = false;
      handshake.user_info = userInfo;
      this.userInfo = handshake;
      this.router.navigate(['/courses']);
    }, (error)=>{
      console.log("Oooops, error");
      console.log(error);
      this.error = error;
      this.isRequest = false;
    });
  }

}

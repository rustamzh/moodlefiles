import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoodleModule } from './moodle/moodle.module';


import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatDialogModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { WebStorageModule } from 'ngx-store';

import { LoginComponent } from "./login/login.component";
import { CoursesComponent } from './courses/courses.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CoursesComponent,
    PrivacyNoticeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MoodleModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    WebStorageModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule
  ],
  providers: [],
  entryComponents: [
    PrivacyNoticeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

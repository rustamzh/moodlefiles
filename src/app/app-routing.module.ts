import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { CoursesComponent } from "./courses/courses.component";
import { BrowserGuard } from './browser.guard';

const routes: Routes = [  
  { path: 'login', component: LoginComponent, canActivate: [BrowserGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [BrowserGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

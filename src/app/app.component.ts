import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'moodle-materila-down'; 
  failed = false;

  constructor(private router: Router){}

  ngOnInit() {
      this.router.navigate(['/login']).then((failed) => this.failed=failed);
  }
}

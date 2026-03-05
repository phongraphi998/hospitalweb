import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HMS Hospital';

  constructor(private router: Router) {}

  isLoginPage(): boolean {
    const url = this.router.url;
    return url === '/login' || url.startsWith('/doctor') || url.startsWith('/nurse') || url.startsWith('/admin');
  }
}
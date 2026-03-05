import { Component, Input } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  @Input() title = '';
  constructor(public auth: AuthService) {}
  logout(): void { this.auth.logout(); }
}

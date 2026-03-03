import { Component } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent {
  constructor(private authService: AuthService) {}

  logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      this.authService.logout();
    }
  }
}

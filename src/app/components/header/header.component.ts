import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  mobileMenuOpen = false;
  activeNav = 'hero';

  ngOnInit(): void {
    this.onWindowScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Check which section is most in view and update activeNav accordingly
    const sections = [
      { id: 'hero', name: 'home' },
      { id: 'about', name: 'about' },
      { id: 'services', name: 'services' },
      { id: 'departments', name: 'departments' },
      { id: 'doctors', name: 'doctors' },
      { id: 'faq', name: 'faq' },
      { id: 'contact', name: 'contact' },
    ];

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        // If section is near the top of viewport (within 200px from top)
        if (rect.top <= 200 && rect.bottom > 0) {
          this.activeNav = section.name;
          break;
        }
      }
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}

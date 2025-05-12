import { Component,OnInit } from '@angular/core';
import { AuthService } from '../service/user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.css']
})
export class ClientNavbarComponent implements OnInit{
  loggedUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
        this.loggedUser = JSON.parse(storedUser);
        console.log("Utilisateur connecté :", this.loggedUser);
    } else {
        console.warn("Aucun utilisateur trouvé dans le localStorage !");
    }
}

logout() {
  // Supprime les cookies et redirige vers la page de login
  this.authService.logout();
  window.location.href = 'http://localhost:4200/'; // Ou l'URL de login appropriée
}



isSidebarOpen = false; // Property to track sidebar state

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
  // You might also want to interact with the DOM here to add/remove classes
  // for animation, or use Angular's Renderer2 for more controlled DOM manipulation.
  document.body.classList.toggle('sidebar-open', this.isSidebarOpen);
  const navbar = document.querySelector('.navbar-fixed-top');
  if (navbar) {
    navbar.classList.toggle('sidebar-open', this.isSidebarOpen);
  }
}
}

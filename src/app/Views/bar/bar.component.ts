import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {
  loggedUser: any = null;
  isSidebarClosed = false;
  isProfileMenuVisible = false; 
  activeMenu: string | null = null;
  isOnline = true;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef // Pour forcer la détection des changements si nécessaire
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
        this.loggedUser = JSON.parse(storedUser);
        console.log("Utilisateur connecté :", this.loggedUser);
    } else {
        console.warn("Aucun utilisateur trouvé dans le localStorage !");
    }
    this.cdr.detectChanges();
  }

  // Fonction pour basculer l'affichage du menu de profil
  toggleProfileMenu() {
    this.isProfileMenuVisible = !this.isProfileMenuVisible;
    this.cdr.detectChanges(); // S'assurer que la détection des changements est effectuée après un changement d'état
  }

  // Fonction pour basculer la sidebar
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
    this.cdr.detectChanges(); // S'assurer que la détection des changements est effectuée après un changement d'état
  }

  // Fonction pour basculer entre les sous-menus
  toggleSubMenu(menu: string) {
    this.activeMenu = this.activeMenu === menu ? null : menu;
    this.cdr.detectChanges();
  }

  // Fonction de déconnexion
  logout() {
    this.authService.logout().subscribe(
      (response: string) => {
        console.log(response); // "Logout successful."
        
        // Ajouter un délai avant la redirection pour s'assurer que la session est bien effacée
        setTimeout(() => {
          this.router.navigate(['']); // Utilisation d'Angular Router pour rediriger vers la page de login
        }, 1000); // Délai de 1 seconde pour s'assurer que la session est terminée
      },
      (error) => {
        console.error('Erreur lors de la déconnexion', error);
        // Optionnel: ajouter une notification ou un message d'erreur
      }
    );
  }
}

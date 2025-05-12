import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/user/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedUser: any = null;
  user: any;  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('adminUser');
    const token = localStorage.getItem('token'); // Vérifie aussi si un token est présent
  
    if (storedUser && token) {
      this.loggedUser = JSON.parse(storedUser);
      console.log("Utilisateur connecté :", this.loggedUser);
  
      // Vérifie le rôle et redirige si nécessaire
      if (this.loggedUser.role === 'Admin') {
        this.router.navigate(['/user-list']);
      } else if (this.loggedUser.role === 'Client') {
        this.router.navigate(['/clientInterface']);
      }
    } else {
      console.warn("Aucun utilisateur trouvé dans le localStorage ou token manquant !");
    }
  }
  

logout() {
  // Supprime les cookies et redirige vers la page de login
  this.authService.logout();
  window.location.href = 'http://localhost:4200/'; // Ou l'URL de login appropriée
}

checkSession() {
  // Vérifie si un token est présent dans le localStorage ou les cookies avant de tenter d'obtenir la session
  const token = localStorage.getItem('token');  // Ou utiliser des cookies si nécessaire

  if (!token) {
    // Si le token n'existe pas, redirige directement vers la page de connexion
    this.router.navigate(['']);
    return;
  }

  // Si le token existe, on appelle le service pour récupérer les informations de session
  this.authService.getSession().subscribe(
    (response: any) => {
      console.log('Session active:', response);
      this.user = response.user;  // Stocke l'utilisateur dans la variable `user`

      // Redirection en fonction du rôle de l'utilisateur
      if (this.user.role === 'Admin') {
        window.location.href = 'http://localhost:4200/user-list';  // Rediriger vers l'admin
      } else if (this.user.role === 'Client') {
        this.router.navigate(['/clientInterface']);  // Rediriger vers la page d'accueil du client
      } else {
        this.router.navigate(['']);  // Si aucun rôle, redirige vers la page de login
      }
    },
    (error) => {
      // Si une erreur survient (par exemple, si la session a expiré)
      console.error('Erreur de session:', error);
      Swal.fire({
        icon: 'error',
        title: 'Session expirée',
        text: 'Votre session a expiré. Veuillez vous reconnecter.',
        confirmButtonColor: '#d33',
      });

      // Redirige vers la page de login si la session a expiré ou si une autre erreur survient
      this.router.navigate(['']);
    }
  );
}

}

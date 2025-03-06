import { Component, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/service/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import {Teams} from '../model/teams.model';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/user/auth.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  private apiUrl = 'http://localhost:8089/Constructify/user';
  private apiUrl1 = 'http://localhost:8090/PIDEV-equipe/teams';
  
  email: string = '';
  password: string = '';
  showTeamField: boolean = false;
  showSignUpForm: boolean = false;
  showSignInForm: boolean = false;
  teams: Teams[] = [];
  user = { firstname: '', lastname: '', email: '', password: '', phone: '', role: '' , teamId: ''};
  message = '';
  roles = [
    { value: 'Client', viewValue: '👤 Client - Looking for services' },
    { value: 'Project_Manager', viewValue: '🛠️ Project Manager - Managing projects' }
  ];
  

  constructor(private authService: AuthService,private http: HttpClient, private userService: UserService,private cdr: ChangeDetectorRef, private router: Router,private route: ActivatedRoute,private snackBar: MatSnackBar,) {}


  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const showTeamField = urlParams.get('showTeamField');
  
    if (showTeamField === 'true') {
      const signInContainer = document.getElementById('signInContainer');
      const signUpContainer = document.getElementById('signUpContainer');
  
      if (signInContainer && signUpContainer) {
        signInContainer.classList.add('hidden');
        signUpContainer.classList.remove('hidden');
      }
    }
  }
  openAddEmployerForm() {
    this.showSignUpForm = true;
    this.showSignInForm = false;
  }

  openSignInForm() {
    this.showSignUpForm = false;
    this.showSignInForm = true;
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['showTeamField'] === 'true') {
        this.showTeamField = true;
        this.roles = [
          { value: 'Employer', viewValue: '👷 Employer - Worker' }
        ];
      }
    });
    this.loadTeams();
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && signInButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });

      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }
  }
  loadTeams() {
    this.userService.getAllTeams().subscribe(
      (teams: Teams[]) => {
        this.teams = teams;
        this.cdr.detectChanges();
        console.log(this.teams);
      },
      (error) => {
        console.error('Error loading teams:', error.message || JSON.stringify(error));
        //alert('Erreur lors du chargement des équipes.');
      }
    );
  }

  register() {
    console.log("User data:", this.user);

    // Validation des champs
    if (!this.user.firstname || !this.user.lastname || !this.user.email || !this.user.password || !this.user.phone || !this.user.role) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Please fill all fields.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (!this.validateEmail(this.user.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Please enter a valid email.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(this.user.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'The password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (!/^\d{8}$/.test(this.user.phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'The phone number must contain exactly 8 digits.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Appel du service pour enregistrer l'utilisateur
    this.userService.registerUser(this.user).subscribe(
      (response) => {
        console.log("Response:", response);
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Registration successful! Please confirm your email to activate your account.',
          confirmButtonColor: '#28a745'
        });

        const showTeamField = this.route.snapshot.queryParamMap.get('showTeamField') === 'true';

        if (showTeamField) {
          window.location.href = "http://localhost:4200/list-teams";
        } else {
          this.router.navigate(['']);
        }
      },
      (error) => {
        console.error("Error:", error); // 🔥 Vérifier l'erreur en console

        let errorMessage = 'Registration failed. Please try again.';

        if (error.status === 400) {
          console.log("Backend error message:", error.error);

          if (typeof error.error === 'string' && error.error.includes('Email already in use')) {
            errorMessage = 'Email is already in use.';
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
        }

        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: errorMessage,
          confirmButtonColor: '#d33'
        });
      }
    );
}



login() {
  // Vérifie que l'email et le mot de passe sont remplis
  if (!this.email || !this.password) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur!',
      text: 'Email et mot de passe sont requis.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  const credentials = { email: this.email, password: this.password };

  this.authService.login(credentials).subscribe(
    (response: any) => {
      if (response && response.user) {
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie!',
          text: 'Redirection en cours...',
          confirmButtonColor: '#28a745',
          timer: 2000,
          showConfirmButton: false
        });

        // Stocke les informations utilisateur et le token dans le localStorage
        const userInfo = JSON.stringify(response.user);
        localStorage.setItem('adminUser', userInfo);
        localStorage.setItem('token', response.token);

        // Crée les paramètres de la requête pour éviter les problèmes d'encodage
        const queryParams = {
          token: response.token,
          userId: response.user.id,
          role: response.user.role
        };

        // Déterminer l'URL de redirection en fonction du rôle
        const redirectUrl = response.user.role === 'Admin'
          ? '/user-list'
          : '/clientInterface';

        // Redirige avec un délai de 2 secondes
        setTimeout(() => {
          this.router.navigate([redirectUrl], { queryParams }); // Utilisation d'un objet JS, pas de HttpParams
        }, 2000);
      }
    },
    (error) => {
      // Gérer l'erreur en affichant le message correctement
      const errorMessage = error.error?.error || 'Échec de la connexion, veuillez réessayer.';
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: errorMessage,  // Affiche le message d'erreur reçu du backend
        confirmButtonColor: '#d33'
      });
    }
  );
}





  private showErrorPopup(error: HttpErrorResponse): void {
    let errorMessage = 'Une erreur est survenue, veuillez réessayer.';

    if (error.error && typeof error.error === 'string') {
      errorMessage = error.error; // Afficher le message d'erreur du backend
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    Swal.fire({
      icon: 'error',
      title: 'Erreur!',
      text: errorMessage,
      confirmButtonColor: '#d33'
    });
  }



  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
  

  

}

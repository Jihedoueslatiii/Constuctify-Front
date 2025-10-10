import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user/user.service';
import { User } from '../../model/user.model';
import { Role } from '../../model/user.model';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from 'src/app/navbar/navbar.component';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  user: User = { 
    id: 0, 
    firstname: '', 
    lastname: '', 
    email: '', 
    phone: '', 
    role: Role.Client, 
    password: '' ,
    teamId: null // Ajout d'une valeur vide pour éviter l'erreur
  };
  
  roles: string[] = ['Client', 'Employer', 'Admin', 'Project_Manager']; // Liste des rôles disponibles

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
  
    if (userId) {
      this.userService.getUserById(Number(userId)).subscribe({
        next: (data) => {
          if (data) {
            this.user = data;
            this.cdr.detectChanges();
            console.log("Utilisateur récupéré :", this.user);
          } else {
            console.error("L'utilisateur n'existe pas.");
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de l\'utilisateur', err);
        }
      });
    }
  }
  

  updateRole(): void {
    if (this.user) {
      this.userService.updateUserRole(this.user.id, this.user.role).subscribe({
        next: () => {
          // Affiche un message de succès avec Toastr
          this.toastr.success('Role updated successfully!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
          
          this.router.navigate(['/users']); // Redirection vers la liste des utilisateurs
        },
        error: (err) => {
          console.error('Error updating role', err);
          // Affiche un message d'erreur avec Toastr
          this.toastr.error('Error updating role', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        }
      });
    }
  }
  

  cancel(): void {
    this.router.navigate(['/users']); // Annuler et retourner à la liste des utilisateurs
  }
}

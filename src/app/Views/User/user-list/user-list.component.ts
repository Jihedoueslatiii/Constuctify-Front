import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class ViewUserComponent implements OnInit {
  listUsers: User[] = [];
  filteredUsers: User[] = [];
  roles: string[] = ['Client', 'Admin', 'Project_Manager', 'Employer'];
  selectedRole: string = '';
  page: number = 0;  // Current page (0-based index)
  itemsPerPage: number = 5; // Items per page
  totalUsers: number = 0; // Total number of users

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.cdr.detectChanges();
  }

  loadUsers(): void {
    this.userService.getAllUsers(this.page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.filteredUsers = response.content;  // Liste des utilisateurs pour la page
        this.totalUsers = response.totalElements;  // Nombre total d'utilisateurs
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur de récupération des utilisateurs:', err);
      }
    });
  }
  
  

  searchByRole(): void {
    if (this.selectedRole) {
      // Si un rôle est sélectionné, filtrez les utilisateurs par rôle
      this.userService.getUsersByRole(this.selectedRole).subscribe(
        (users) => {
          this.filteredUsers = users;  // Liste des utilisateurs filtrés par rôle
          this.totalUsers = users.length;  // Nombre total d'utilisateurs filtrés
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error filtering by role:', error);
        }
      );
    } else {
      // Si aucun rôle n'est sélectionné (All), chargez tous les utilisateurs
      this.loadUsers();  // Charge tous les utilisateurs sans filtre
    }
  }
  

  deleteUser(userId: number): void {
    const snackBarRef = this.snackBar.open('Are you sure you want to delete this user?', 'Delete', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['confirmation-snackbar']
    });

    snackBarRef.onAction().subscribe(() => {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          this.toastr.success('User deleted successfully!', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        },
        error: (err) => {
          this.toastr.error('Error deleting user', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        }
      });
    });
  }

  updateUser(user: User): void {
    this.router.navigate(['/update-user', user.id]);
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    console.log(`Page Index: ${this.page}, Page Size: ${this.itemsPerPage}`);
    this.loadUsers(); // Reload users based on the page
  }
}

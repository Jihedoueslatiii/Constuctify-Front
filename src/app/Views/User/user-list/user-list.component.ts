import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { TeamsService } from '../../service/teams/teams.service';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SearchService } from '../../service/search.service';

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
  searchTerm: string = ''; // Value for search input
  searchTermSubscription!: Subscription; // Assure-toi que le mot-clé '!' est ajouté ici

  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private teamService: TeamsService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.searchTermSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.onSearchChange(); // Met à jour le filtrage dès que le terme de recherche change
    });
    this.cdr.detectChanges();
  }
  onSearchChange(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    // Filtrer les utilisateurs en fonction du texte de recherche
    this.filteredUsers = this.listUsers.filter(user =>
      user.firstname.toLowerCase().includes(searchTermLower) ||
      user.lastname.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.role.toLowerCase().includes(searchTermLower) ||
      user.phone.toLowerCase().includes(searchTermLower)
    );
    this.totalUsers = this.filteredUsers.length;  // Mettre à jour le total d'utilisateurs filtrés
  }
  loadUsers(): void {
    this.userService.getAllUsers(this.page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.listUsers = response.content;  // Liste complète des utilisateurs
        this.filteredUsers = [...this.listUsers];  // Initialiser les utilisateurs filtrés
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

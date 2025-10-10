import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { TeamsService } from '../../service/teams/teams.service';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { SelectTeamDialogComponent } from '../select-team-dialog/select-team-dialog.component';
import { SearchService } from '../../service/search.service'; // Assure-toi que le chemin est correct
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-employer',
  templateUrl: './list-employer.component.html',
  styleUrls: ['./list-employer.component.css']
})
export class ListEmployerComponent implements OnInit, OnDestroy {
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
    private teamService: TeamsService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private searchService: SearchService // Injecte le service de recherche
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.searchTermSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.onSearchChange(); // Met à jour le filtrage dès que le terme de recherche change
    });
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.searchTermSubscription) {
      this.searchTermSubscription.unsubscribe(); // Se désabonne lorsque le composant est détruit
    }
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

  onSearchChange(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    // Filtrer les utilisateurs en fonction du texte de recherche
    this.filteredUsers = this.listUsers.filter(user =>
      user.firstname.toLowerCase().includes(searchTermLower) ||
      user.lastname.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.phone.toLowerCase().includes(searchTermLower)
    );
    this.totalUsers = this.filteredUsers.length;  // Mettre à jour le total d'utilisateurs filtrés
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
    this.loadUsers(); // Recharger les utilisateurs en fonction de la page
  }

  openAssignTeamDialog(userId: number): void {
    const dialogRef = this.dialog.open(SelectTeamDialogComponent, {
      data: { userId }
    });
  
    // Charger les équipes directement dans le composant appelant
    this.teamService.getAllTeams().subscribe(teams => {
      dialogRef.componentInstance.teams = teams;
    });
  
    dialogRef.afterClosed().subscribe(assigned => {
      if (assigned) {
        this.toastr.success('Employee assigned to team successfully!', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          tapToDismiss: true,
          extendedTimeOut: 1000
        });
        this.loadUsers();
      }
    });
  }
}

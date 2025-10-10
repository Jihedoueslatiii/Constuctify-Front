import { Component, OnInit, ViewChild } from '@angular/core';
import { TeamsService } from '../../service/teams/teams.service';
import { Teams } from '../../model/teams.model';
import { User } from '../../model/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../service/user/auth.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SearchService } from '../../service/search.service'; // Assure-toi que le chemin est correct


@Component({
  selector: 'app-list-team',
  templateUrl: './list-team.component.html',
  styleUrls: ['./list-team.component.css']
})
export class ListTeamComponent implements OnInit {
  teams: Teams[] = [];
  teamUsers: { [key: number]: User[] } = {}; // Stocke les employés de chaque équipe
  pageSize: number = 5; // Nombre d'éléments par page
  currentPage: number = 0; // Page courante
  totalTeams: number = 0; // Nombre total d'équipes
  searchTerm: string = ''; // Value for search input
  searchTermSubscription!: Subscription; // Assure-toi que le mot-clé '!' est ajouté ici
  teamRatings: { [key: number]: number } = {}; // Stocke les notes des équipes
  userRatings: { [key: number]: number } = {}; // Stocke les notes données par l'utilisateur
  averageRatings: { [key: number]: number } = {}; // Stocke la moyenne des notes par équipe
  totalUsers: number = 0;
  allTeams: Teams[] = []; // Garde toutes les équipes originales ici


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private dialog: MatDialog,
    private teamsService: TeamsService,
    private searchService: SearchService, // Injection du service de recherche
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadUserRatings(); // <--- AJOUT ICI
    this.searchTermSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.onSearchChange(); // Met à jour le filtrage dès que le terme de recherche change
    });
  }
  onSearchChange(): void {
    if (this.searchTerm.trim() === '') {
      // Si le terme de recherche est vide, recharger toutes les équipes
      this.loadTeams();
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      // Filtrer les utilisateurs en fonction du texte de recherche
      this.teams = this.teams.filter(team =>
        team.teamName.toLowerCase().includes(searchTermLower)
      );
    }
    this.totalUsers = this.teams.length; // Mettre à jour le total d'utilisateurs filtrés
  }
  

  loadTeams(): void {
    this.teamsService.getAllTeams2(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.teams = response.content;
        this.totalTeams = response.totalElements;
        // Charger les employés de chaque équipe ici !
        this.teams.forEach(team => {
          if (team.id) {
            this.loadUsersByTeam(team.id); // <-- AJOUT IMPORTANT
            this.cdr.detectChanges();
          }
        });
  
        // Charger les moyennes
        const ratingRequests = this.teams.map(team =>
          this.teamsService.getAverageRating(team.id).pipe(
            tap(average => this.averageRatings[team.id] = average)
          )
        );
  
        forkJoin(ratingRequests).subscribe({
          next: () => {
            this.loadUserRatings();
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Erreur lors du chargement des ratings', err)
        });
      },
      error: (err) => console.error('Erreur lors du chargement des équipes:', err)
    });
  }
  
  
  
  
  
  

  loadUsersByTeam(teamId: number): void {
    this.teamsService.getUsersByTeam(teamId).subscribe({
      next: (users) => {
        this.teamUsers[teamId] = users;
      },
      error: (err) => {
        console.error(`Erreur lors du chargement des employés pour l'équipe ${teamId}:`, err);
      }
    });
  }

  removeUser(teamId: number, userId: number): void {
    this.teamsService.removeEmployeeFromTeam(teamId, userId).subscribe({
      next: () => {
        this.toastr.success('User removed successfully', 'Success', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          tapToDismiss: true,
          extendedTimeOut: 1000
        });
        this.teamUsers[teamId] = this.teamUsers[teamId].filter(user => user.id !== userId);
        this.loadTeams();
      },
      error: (err) => {
        console.error('Error removing user', err);
        this.toastr.error('Error removing the user', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          tapToDismiss: true,
          extendedTimeOut: 1000
        });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    console.log(`Page Index: ${this.currentPage}, Page Size: ${this.pageSize}`);
    this.loadTeams(); // Recharge les équipes en fonction de la page
  }
  

  // Méthode pour ajouter une note à une équipe
  addRating(teamId: number, ratingValue: number): void {
    const userJson = localStorage.getItem('adminUser');
    const user = userJson ? JSON.parse(userJson) : null;
  
    if (!user || !user.id) {
      this.toastr.error('Utilisateur non connecté', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true,
        tapToDismiss: true,
        extendedTimeOut: 1000
      });
      return;
    }
  
    const userId = user.id;
  
    // Check if the user has already rated this team
    if (this.userRatings[teamId] !== undefined) {
      this.toastr.warning('Vous avez déjà noté cette équipe.', 'Attention', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true,
        tapToDismiss: true,
        extendedTimeOut: 1000
      });
      return;
    }
  
    this.teamsService.addRating(userId, teamId, ratingValue).subscribe({
      next: () => {
        this.toastr.success('Note ajoutée avec succès', 'Succès', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          tapToDismiss: true,
          extendedTimeOut: 1000
        });
  
        // Store the rating in the local state
        this.userRatings[teamId] = ratingValue;
        this.loadUserRatings();
        setTimeout(() => {
          this.loadAverageRating(teamId); // Refresh the average rating after adding
        }, 500);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la note', err);
        this.toastr.error('Erreur lors de l\'ajout de la note', 'Erreur', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          tapToDismiss: true,
          extendedTimeOut: 1000
        });
      }
    });
  }
  
  
  
  
  

// Méthode pour charger la moyenne des notes d'une équipe
loadAverageRating(teamId: number): void {
  this.teamsService.getAverageRating(teamId).subscribe({
    next: (average) => {
      this.averageRatings[teamId] = average;
    },
    error: (err) => {
      console.error('Error loading average rating', err);
    }
  });
}

// Méthode pour charger les notes de l'utilisateur
loadUserRatings(): void {
  const userJson = localStorage.getItem('adminUser');
  const user = userJson ? JSON.parse(userJson) : null;

  if (!user || !user.id) {
    console.warn('Utilisateur non connecté pour charger les ratings');
    return;
  }

  const userId = user.id;

  this.teamsService.getUserRatings(userId).subscribe({
    next: (ratingsArray) => {
      this.userRatings = {}; // Réinitialiser les ratings
      
      // Parcourir toutes les évaluations et les stocker
      ratingsArray.forEach((rating: any) => {
        // Utiliser rating.team.id si team est un objet, sinon rating.teamId
        const teamId = rating.team?.id || rating.teamId;
        if (teamId) {
          this.userRatings[teamId] = rating.ratingValue || rating.rating;
        }
      });
      
      console.log('User ratings loaded:', this.userRatings);
      this.cdr.detectChanges(); // Forcer la détection des changements
    },
    error: (err) => {
      console.error('Erreur lors du chargement des notes utilisateur', err);
    }
  });
}


  
}
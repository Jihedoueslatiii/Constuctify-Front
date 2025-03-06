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

@Component({
  selector: 'app-list-team',
  templateUrl: './list-team.component.html',
  styleUrls: ['./list-team.component.css']
})
export class ListTeamComponent implements OnInit {
  teams: Teams[] = [];
  teamUsers: { [key: number]: User[] } = {}; // Stocke les employés de chaque équipe
  pageSize: number = 10; // Nombre d'éléments par page
  currentPage: number = 0; // Page courante
  totalTeams: number = 0; // Nombre total d'équipes

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private dialog: MatDialog,
    private teamsService: TeamsService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamsService.getAllTeams2(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.teams = response.content; // Liste des équipes
        this.totalTeams = response.totalElements; // Nombre total d'équipes
        this.cdr.detectChanges(); // Détecter les changements manuellement
      },
      error: (err) => {
        console.error('Erreur lors du chargement des équipes:', err);
      }
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
  
  
}
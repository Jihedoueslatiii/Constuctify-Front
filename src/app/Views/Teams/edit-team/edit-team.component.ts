import { Component , ChangeDetectorRef, OnInit} from '@angular/core';
import { TeamsService } from '../../service/teams/teams.service';
import { Teams } from '../../model/teams.model';
import { User } from '../../model/user.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.css']
})
export class EditTeamComponent implements OnInit {

  teams: Teams[] = [];
    teamUsers: { [key: number]: User[] } = {}; // Stocke les employés de chaque équipe
    selectedTeam: any;
    isSaving = false;
    constructor(private dialog: MatDialog,private snackBar: MatSnackBar, private teamsService: TeamsService,private userService: UserService, private router: Router, private cdr: ChangeDetectorRef,private toastr: ToastrService) {}
  
    ngOnInit(): void {
      this.loadTeams();
    }
  
    loadTeams(): void {
      this.teamsService.getAllTeams().subscribe({
        next: (teams) => {
          this.teams = teams;
          this.teams.forEach((team) => {
            if (team.id !== undefined) { // Vérifie que team.id n'est pas undefined
              this.loadUsersByTeam(team.id);
              this.cdr.detectChanges();
            }
          });
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
          this.cdr.detectChanges(); // Force la détection des changements pour l'UI
        },
        error: (err) => {
          console.error(`Erreur lors du chargement des employés pour l'équipe ${teamId}:`, err);
        }
      });
    }
    

  updateTeamName(team: any): void {
    this.isSaving = true;
    const newTeamName = team.teamName.trim();

    if (newTeamName === '') {
      this.isSaving = false;
      this.toastr.warning('Team name cannot be empty', 'Warning', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
            closeButton: true,
            tapToDismiss: true,
            extendedTimeOut: 1000
      });
      return;
    }

    // Vérifier si le nom existe déjà dans la liste des équipes
    this.teamsService.getAllTeams().pipe(first()).subscribe((teams) => {
      const nameExists = teams.some((t: any) => t.teamName.toLowerCase() === newTeamName.toLowerCase());

      if (nameExists) {
        this.isSaving = false;
        this.toastr.error('This team name already exists', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
            closeButton: true,
            tapToDismiss: true,
            extendedTimeOut: 1000
        });
        return;
      }

      // Mise à jour du nom si tout est valide
      this.teamsService.updateTeamName(team.id, newTeamName).pipe(first()).subscribe(
        (updatedTeam) => {
          this.isSaving = false;
          console.log('Team name updated successfully', updatedTeam);
          this.toastr.success('Team name updated successfully', 'Success', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
          this.loadTeams();
          this.router.navigate(['/list-teams']);
        },
        (error) => {
          this.isSaving = false;
          console.error('Error updating the team', error);
          this.toastr.error('Error updating the team', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true,
            tapToDismiss: true,
            extendedTimeOut: 1000
          });
        }
      );
    });
  }


  deleteTeam(teamId: number): void {
    
    this.teamsService.getUsersByTeam(teamId).subscribe({
      next: (users) => {
        // Step 2: Check if the team has employees
        if (users.length > 0) {
          // Replace the classic confirmation with a snackbar to ask if the user wants to disassociate employees
          const snackBarRef = this.snackBar.open('This team has employees. Do you want to disassociate them before deleting the team?', 'Disassociate', {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: ['confirmation-snackbar']
          });
  
          snackBarRef.onAction().subscribe(() => {
            // Disassociate each employee from the team (via the `user` API)
            users.forEach((user: any) => {
              this.teamsService.removeEmployeeFromTeam(teamId, user.id).subscribe({
                next: () => {
                  this.toastr.info(`Employee ${user.firstname} ${user.lastname} successfully disassociated from the team.`, 'Disassociation Successful', { timeOut: 3000 });
                },
                error: (err) => {
                  this.toastr.error(`Error disassociating employee ${user.firstname} ${user.lastname}`, 'Error', { timeOut: 3000 });
                }
              });
            });
  
            // After disassociating all employees, proceed with deleting the team
            this.confirmDeleteTeam(teamId);
          });
        } else {
          // If the team has no employees, proceed directly with deletion
          this.confirmDeleteTeam(teamId);
        }
      },
      
      error: (err) => {
        console.error('Error retrieving users associated with the team', err);
        this.toastr.error('Error retrieving users associated with the team', 'Error', { timeOut: 3000 });
      }
    });
  }
  
  // Method to confirm and delete the team
  confirmDeleteTeam(teamId: number): void {
    const snackBarRef = this.snackBar.open('Are you sure you want to delete this team?', 'Delete', {
      duration: 10000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['confirmation-snackbar']
    });
  
    snackBarRef.onAction().subscribe(() => {
      this.teamsService.deleteTeam(teamId).subscribe({
        next: () => {
          console.log('Team deleted successfully');
          this.teams = this.teams.filter(team => team.id !== teamId); // Update the list of teams
          this.toastr.success('Team deleted successfully', 'Success', { timeOut: 3000 });
        },
        error: (err) => {
          console.error('Error deleting team:', err);
          this.toastr.error('Error deleting team', 'Error', { timeOut: 3000 });
        }
      });
    });
  }
  
  
  
  
  
  
  
  
    
    
    
    

}

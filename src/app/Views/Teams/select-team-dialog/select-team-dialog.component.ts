import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamsService } from '../../service/teams/teams.service';
import { Teams} from '../../model/teams.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-select-team-dialog',
  templateUrl: './select-team-dialog.component.html',
  styleUrls: ['./select-team-dialog.component.css']
})

export class SelectTeamDialogComponent {
  teams: Teams[] = [];
  isLoading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<SelectTeamDialogComponent>,
    private teamsService: TeamsService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.loadTeams();
  }

  loadTeams(): void {
    this.isLoading = true;
    this.teamsService.getAllTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  assignTeam(teamId: number): void {
    this.teamsService.assignEmployeeToTeam(this.data.userId, teamId).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        // Gérer l'erreur si nécessaire
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
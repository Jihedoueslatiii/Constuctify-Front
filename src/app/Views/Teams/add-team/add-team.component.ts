import { Component } from '@angular/core';
import { TeamsService } from '../../service/teams/teams.service';
import { Teams} from '../../model/teams.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent {
  team: Teams = {
    id: 0,
    teamName: '',
    
  };
  suggestedName: string = '';

  constructor(private teamsService: TeamsService,private router: Router,private snackBar: MatSnackBar,private toastr: ToastrService) {}

  addTeam() {
    if (!this.team.teamName.trim()) {
      this.toastr.error('Le nom de l\'équipe est obligatoire', 'Erreur', {
        timeOut: 3000,
        positionClass: 'toast-top-right', // Position en haut à droite
        progressBar: true,
      });
      return; // Stop execution if input is empty
    }

    this.teamsService.addTeam(this.team).subscribe(
      (response) => {
        console.log('Équipe ajoutée avec succès', response);
        this.team = { id: 0, teamName: '' }; // Réinitialisation du formulaire
        this.toastr.success('Équipe ajoutée avec succès', 'Succès', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
        });
        this.router.navigate(['/list-teams']);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'équipe', error);
        let errorMessage = 'Erreur lors de l\'ajout de l\'équipe';
        if (error.status === 400 && error.error) {
          errorMessage = error.error;
        }

        this.toastr.error(errorMessage, 'Erreur', {
          timeOut: 5000,
          positionClass: 'toast-top-right',
          closeButton: true,
          progressBar: true
        });
      }
    );
  }
  
  openAddEmployerForm() {
    const redirectUrl = "http://localhost:4200/login?showTeamField=true";
    window.location.href = redirectUrl;
  
    // Masquer le formulaire de connexion et afficher uniquement le formulaire d'inscription
    const signInContainer = document.getElementById('signInContainer');
    const signUpContainer = document.getElementById('signUpContainer');
  
    if (signInContainer && signUpContainer) {
      signInContainer.classList.add('hidden');
      signUpContainer.classList.remove('hidden');
    }
  }

  suggestTeamName(): void {
    this.teamsService.suggestTeamName().subscribe({
      next: (name) => {
        this.suggestedName = name;
        this.toastr.info(`Nom suggéré : ${name}`, 'Suggestion AI', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true
        });
      },
      error: (err) => {
        console.error('Erreur lors de la suggestion de nom', err);
        this.toastr.error('Impossible de suggérer un nom d\'équipe', 'Erreur AI');
      }
    });
  }
  
  
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user/user.service';
import { TeamsService } from '../../service/teams/teams.service'; // Importer TeamsService
import { User } from '../../model/user.model';
import { Role } from '../../model/user.model';
import { Teams } from '../../model/teams.model'; // Importer Teams
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-employer',
  templateUrl: './add-employer.component.html',
  styleUrls: ['./add-employer.component.css'],
})
export class AddEmployerComponent implements OnInit {
  employer: User = {
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    role: Role.Employer,
    teamId: null, // ID de l'équipe sélectionnée
  };

  teams: Teams[] = []; // Liste des équipes existantes

  constructor(
    private userService: UserService,
    private teamsService: TeamsService,
    private cdr: ChangeDetectorRef, // Injecter TeamsService
  ) {}

  ngOnInit(): void {
    this.loadTeams(); // Charger la liste des équipes au démarrage
  }

  // Charger la liste des équipes
  loadTeams() {
    this.teamsService.getAllTeams().subscribe(
      (teams: Teams[]) => {
        this.teams = teams;
        this.cdr.detectChanges();
        console.log(this.teams);
      },
      (error) => {
        console.error('Error loading teams:', error.message || JSON.stringify(error));
        alert('Erreur lors du chargement des équipes.');
      }
    );
  }

  // Ajouter un employé
  addEmployee() {
    this.userService.registerUser(this.employer).subscribe(
      (response: User) => {
        console.log('Employee added:', response);
        alert('Employé ajouté avec succès !');
        this.resetForm(); // Réinitialiser le formulaire après l'ajout
      },
      (error: any) => {
        console.error('Error adding employee:', error);
        alert('Erreur lors de l\'ajout de l\'employé.');
      }
    );
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.employer = {
      id: 0,
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phone: '',
      role: Role.Employer,
      teamId: null,
    };
  }
}
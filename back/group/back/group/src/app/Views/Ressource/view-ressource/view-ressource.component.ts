import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RessourceService } from '../../service/ressource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-ressource',
  templateUrl: './view-ressource.component.html',
  styleUrls: ['./view-ressource.component.css']
})
export class ViewRessourceComponent implements OnInit {
  listRessource: any[] = [];

  constructor(
    private http: HttpClient,
    private rs: RessourceService,
    private router: Router // Injection du service Router
  ) {}

  ngOnInit(): void {
    this.rs.getRessource().subscribe(
      res => {
        this.listRessource = res;
      },
      error => {
        console.error('Erreur de récupération des ressources:', error);
      }
    );
  }
  

}

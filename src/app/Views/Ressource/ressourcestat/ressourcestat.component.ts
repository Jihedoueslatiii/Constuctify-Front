import { Component, OnInit } from '@angular/core';
import { RessourceService } from '../../service/ressource.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Enregistre les composants nécessaires

@Component({
  selector: 'app-ressourcestat',
  templateUrl: './ressourcestat.component.html',
  styleUrls: ['./ressourcestat.component.css']
})
export class RessourcestatComponent implements OnInit {
  ressources: any[] = [];
  chart: any;

  constructor(private ressourceService: RessourceService) {}

  ngOnInit(): void {
    this.ressourceService.getRessource().subscribe(data => {
      this.ressources = this.regrouperRessources(data); // Regroupement avant affichage
      this.createChart();
    });
  }

  regrouperRessources(data: any[]): any[] {
    const ressourceMap = new Map<string, number>();

    data.forEach(res => {
      if (ressourceMap.has(res.nomRessource)) {
        ressourceMap.set(res.nomRessource, ressourceMap.get(res.nomRessource)! + res.nombreRessource);
      } else {
        ressourceMap.set(res.nomRessource, res.nombreRessource);
      }
    });

    return Array.from(ressourceMap, ([nomRessource, nombreRessource]) => ({ nomRessource, nombreRessource }));
  }

  createChart(): void {
    const labels = this.ressources.map(res => res.nomRessource);
    const values = this.ressources.map(res => res.nombreRessource);

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById("ressourceChart") as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de Ressources',
          data: values,
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(231, 76, 60, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: '#007bff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

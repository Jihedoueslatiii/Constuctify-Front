import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: ['./predictor.component.css']
})
export class PredictorComponent {
  output = '';
  pdfReady = false;
  depasseBudgetTreeCount: number = 0;
  totalProjects: number = 0;
  projectNames: string[] = [];
  costs: number[] = [];
  budgets: number[] = [];
  rois: number[] = [];
  otherExpenses: number[] = [];

  // Graphique Doughnut
  public doughnutChartLabels: string[] = ['Dépasse', 'Ne dépasse pas'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#f44336', '#4caf50']
    }]
  };
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Répartition des Projets' }
    }
  };

  // Graphique Barres
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Coût réel', backgroundColor: '#ff6384' },
      { data: [], label: 'Budget alloué', backgroundColor: '#36a2eb' }
    ]
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { x: { stacked: true }, y: { stacked: true } },
    plugins: {
      title: { display: true, text: 'Coût vs Budget' }
    }
  };

  // Graphique Radar
  public radarChartData: ChartData<'radar'> = {
    labels: ['Coût', 'Budget', 'ROI', 'Autres Dépenses'],
    datasets: [
      { data: [], label: 'Moyennes', backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'rgba(255,99,132,1)' }
    ]
  };
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Analyse Multidimensionnelle' }
    }
  };

  // Graphique Ligne
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Coût', borderColor: 'rgba(75,192,192,1)', fill: false },
      { data: [], label: 'Budget', borderColor: 'rgba(153,102,255,1)', fill: false }
    ]
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Évolution des Dépenses' }
    }
  };

  constructor(private http: HttpClient) {}

  runPrediction() {
    this.output = 'Exécution en cours...';
    this.pdfReady = false;
    this.resetData();

    this.http.get('http://localhost:8087/Finance/api/python/run', { responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.output = res;
          this.pdfReady = true;
          this.parseOutputData(res);
          this.updateAllCharts();
        },
        error: (err) => {
          this.output = 'Erreur : ' + err.message;
        }
      });
  }

  resetData(): void {
    this.depasseBudgetTreeCount = 0;
    this.totalProjects = 0;
    this.projectNames = [];
    this.costs = [];
    this.budgets = [];
    this.rois = [];
    this.otherExpenses = [];
  }

  parseOutputData(output: string): void {
    const lines = output.split('\n');
    const dataStartIndex = lines.findIndex(line => line.trim().startsWith('0')) + 1;
    
    if (dataStartIndex > 0) {
      for (let i = dataStartIndex - 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(/^\d+\s+\d+/)) { // Ligne commençant par un chiffre (ID)
          const parts = line.split(/\s+/).filter(part => part.trim() !== '');
          
          if (parts.length >= 6) {
            this.projectNames.push(parts[5]);
            this.costs.push(parseFloat(parts[2]));
            this.budgets.push(parseFloat(parts[3]));
            this.otherExpenses.push(parseFloat(parts[4]));
            this.rois.push(parseFloat(parts[5]));
            
            if (parseFloat(parts[2]) > parseFloat(parts[3])) {
              this.depasseBudgetTreeCount++;
            }
          }
        }
      }
    }
    this.totalProjects = this.projectNames.length;
  }

  updateAllCharts(): void {
    // Doughnut Chart
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [{
        data: [this.depasseBudgetTreeCount, this.totalProjects - this.depasseBudgetTreeCount],
        backgroundColor: ['#f44336', '#4caf50']
      }]
    };

    // Bar Chart
    this.barChartData = {
      labels: this.projectNames,
      datasets: [
        { data: this.costs, label: 'Coût réel', backgroundColor: '#ff6384' },
        { data: this.budgets, label: 'Budget alloué', backgroundColor: '#36a2eb' }
      ]
    };

    // Radar Chart (moyennes)
    const avgCost = this.costs.reduce((a, b) => a + b, 0) / this.totalProjects;
    const avgBudget = this.budgets.reduce((a, b) => a + b, 0) / this.totalProjects;
    const avgRoi = this.rois.reduce((a, b) => a + b, 0) / this.totalProjects;
    const avgOther = this.otherExpenses.reduce((a, b) => a + b, 0) / this.totalProjects;

    this.radarChartData = {
      labels: ['Coût', 'Budget', 'ROI', 'Autres Dépenses'],
      datasets: [{
        data: [avgCost, avgBudget, avgRoi, avgOther],
        label: 'Moyennes',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)'
      }]
    };

    // Line Chart
    this.lineChartData = {
      labels: this.projectNames,
      datasets: [
        { data: this.costs, label: 'Coût', borderColor: 'rgba(75,192,192,1)', fill: false },
        { data: this.budgets, label: 'Budget', borderColor: 'rgba(153,102,255,1)', fill: false }
      ]
    };
  }
}
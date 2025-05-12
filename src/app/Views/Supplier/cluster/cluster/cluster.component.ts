import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ClusterService } from 'src/app/Views/service/ClusterService';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {
  clusters: any[] = [];
  error: string | null = null;

  // Chart data
  clusterBarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  industryPieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };

  // Chart options
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { 
        display: true,
        position: 'right'
      }
    }
  };

  constructor(private clusterService: ClusterService) {}

  ngOnInit(): void {
    this.loadClusterData();
  }

  loadClusterData(): void {
    this.clusterService.getClusteringResult().subscribe({
      next: (data) => {
        this.clusters = data;
        this.prepareChartData();
      },
      error: (err) => {
        this.error = 'Error fetching cluster data';
        console.error(err);
      }
    });
  }

  prepareChartData(): void {
    // Prepare bar chart data (cluster distribution)
    const clusterCounts = this.clusters.reduce((acc, supplier) => {
      const cluster = supplier.cluster;
      acc[cluster] = (acc[cluster] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    this.clusterBarChartData = {
      labels: Object.keys(clusterCounts).map(c => `Cluster ${c}`),
      datasets: [{
        data: Object.values(clusterCounts),
        label: 'Suppliers',
        backgroundColor: Object.keys(clusterCounts).map(c => this.getClusterColor(parseInt(c))),
        borderColor: '#ffffff',
        borderWidth: 1
      }]
    };

    // Prepare pie chart data (industry breakdown)
    const industryCounts = this.clusters.reduce((acc, supplier) => {
      const industry = supplier.industry;
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.industryPieChartData = {
      labels: Object.keys(industryCounts),
      datasets: [{
        data: Object.values(industryCounts),
        backgroundColor: [
          '#4cc9f0', '#4361ee', '#3f37c9', '#4895ef', '#560bad',
          '#7209b7', '#b5179e', '#f72585', '#480ca8', '#3a0ca3'
        ]
      }]
    };
  }

  // Helper methods for template
  getUniqueClusters(): number[] {
    const uniqueClusters = [...new Set(this.clusters.map(s => s.cluster))];
    return uniqueClusters.sort((a, b) => a - b);
  }

  getClusterColor(cluster: number): string {
    const colors = {
      1: '#ff9f1c', // orange
      2: '#ff6392', // pink
      3: '#7b2cbf', // purple
      4: '#2ec4b6', // teal
      5: '#e71d36'  // red
    };
    return colors[cluster as keyof typeof colors] || '#cccccc';
  }

  getTotalSuppliers(): number {
    return this.clusters.length;
  }

  getUniqueIndustries(): number {
    return new Set(this.clusters.map(s => s.industry)).size;
  }

  formatKey(key: unknown): string {
    return typeof key === 'string' ? key : '';
  }

  exportCSV(): void {
    if (this.clusters.length === 0) {
      this.error = 'No data to export';
      return;
    }

    const headers = Object.keys(this.clusters[0]);
    const csvRows = [
      headers.join(','),
      ...this.clusters.map(row => 
        headers.map(fieldName => 
          JSON.stringify(row[fieldName], (_, value) => 
            value === null ? '' : value
          )
        ).join(',')
      )
    ];

    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supplier_clusters.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
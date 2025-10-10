import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Supplier } from '../../model/supplier.module';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-supplier-stats',
  templateUrl: './supplier-stats.component.html',
  styleUrls: ['./supplier-stats.component.css']
})
export class SupplierStatsComponent implements OnInit {
  supplierStats: any = {}; // Holds supplier financial data
  statusDistribution: { [key: string]: number } = {}; // Holds supplier status counts
  isLoading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message
  top5Suppliers: Supplier[] = [];
  newSuppliersLast30Days: Supplier[] = []; // New suppliers added in the last 30 days
  recentlyUpdatedSuppliers: Supplier[] = []; // Suppliers updated in the last 30 days

  // Scatter Chart Configuration
  chartData: ChartConfiguration<'scatter'>['data'] = {
    datasets: []
  };
  chartOptions: ChartOptions<'scatter'> = {};

  // Pie Chart Configuration
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#5b7cfa', '#3659db', '#35d8ac', '#4BC0C0', '#2A5D89', '#1E3A5F'],
      },
    ],
  };
  pieChartOptions: ChartOptions<'pie'> = { responsive: true };

  // Bar Chart Configuration
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [], // Supplier names will go here
    datasets: [
      {
        label: 'Last Added Suppliers (Last 30 Days)',
        data: [], // Reliability scores or other metrics will go here
        backgroundColor: '#5b7cfa',
        borderColor: '#3659db',
        borderWidth: 1,
      },
    ],
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Supplier',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Reliability Score',
        },
        beginAtZero: true,
      },
    },
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchSupplierStats();
    this.fetchSupplierStatusDistribution();
    this.fetchTop5Suppliers();
    this.fetchNewSuppliersLast30Days(); // Fetch new suppliers
    this.fetchRecentlyUpdatedSuppliers();
  }

  fetchSupplierStats() {
    this.http.get<any>('http://localhost:8089/SupplierContracts/api/suppliers/financial-health').subscribe(
      (data) => {
        this.supplierStats = data;
        this.isLoading = false;
        this.initializeChart(); // Initialize scatter chart
      },
      (error) => {
        this.errorMessage = 'Failed to fetch supplier stats. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching supplier stats:', error);
      }
    );
  }

  fetchSupplierStatusDistribution() {
    this.http.get<{ [key: string]: number }>('http://localhost:8089/SupplierContracts/api/suppliers/status-distribution').subscribe(
      (data) => {
        this.statusDistribution = data;
        this.initializePieChart(); // Initialize pie chart after fetching data
      },
      (error) => {
        console.error('Error fetching supplier status distribution:', error);
      }
    );
  }

  initializeChart() {
    if (!this.supplierStats || !this.supplierStats.reliabilityVsContractValue) {
      console.error('No data available for scatter chart.');
      return;
    }

    this.chartData = {
      datasets: [
        {
          label: 'Reliability Score vs. Contract Value',
          data: this.supplierStats.reliabilityVsContractValue.map((item: any) => ({
            x: item.reliabilityScore,
            y: item.totalContractValue,
          })),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Reliability Score',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Total Contract Value',
          },
        },
      },
    };
  }

  initializePieChart() {
    if (!this.statusDistribution || Object.keys(this.statusDistribution).length === 0) {
      console.error('No data available for pie chart.');
      return;
    }

    this.pieChartData = {
      labels: Object.keys(this.statusDistribution), // Supplier status labels (e.g., "Active", "Inactive")
      datasets: [
        {
          data: Object.values(this.statusDistribution), // Counts of each status
          backgroundColor: ['#5b7cfa', '#3659db', '#35d8ac', '#4BC0C0', '#2A5D89', '#1E3A5F'],
        },
      ],
    };
  }

  fetchTop5Suppliers() {
    this.http.get<Supplier[]>('http://localhost:8089/SupplierContracts/api/suppliers/top5-by-reliability').subscribe(
      (data) => {
        this.top5Suppliers = data;
      },
      (error) => {
        console.error('Error fetching top 5 suppliers:', error);
      }
    );
  }

  fetchNewSuppliersLast30Days() {
    this.http.get<Supplier[]>('http://localhost:8089/SupplierContracts/api/suppliers/new-suppliers-last-30-days').subscribe(
      (data) => {
        this.newSuppliersLast30Days = data;
        this.initializeBarChart(); // Initialize bar chart immediately after fetching data
      },
      (error) => {
        console.error('Error fetching new suppliers:', error);
      }
    );
  }

  fetchRecentlyUpdatedSuppliers() {
    this.http.get<Supplier[]>('http://localhost:8089/SupplierContracts/api/suppliers/recently-updated-suppliers').subscribe(
      (data) => {
        this.recentlyUpdatedSuppliers = data;
      },
      (error) => {
        console.error('Error fetching recently updated suppliers:', error);
      }
    );
  }

  // Initialize Bar Chart
  initializeBarChart() {
    if (!this.newSuppliersLast30Days || this.newSuppliersLast30Days.length === 0) {
      console.warn('No data available for bar chart. Initializing with empty data.');
      this.barChartData.labels = [];
      this.barChartData.datasets[0].data = [];
    } else {
      // Populate bar chart labels and data
      this.barChartData.labels = this.newSuppliersLast30Days.map((supplier) => supplier.name);
      this.barChartData.datasets[0].data = this.newSuppliersLast30Days.map((supplier) => supplier.reliabilityScore);
    }

    // Trigger change detection
    this.cdr.detectChanges();
  }

  // Export Dashboard as PDF
  exportDashboardAsPDF() {
    const dashboardElement = document.getElementById('dashboard'); // Ensure your dashboard has an ID

    if (!dashboardElement) {
      console.error('Dashboard element not found.');
      return;
    }

    html2canvas(dashboardElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size, portrait orientation
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height to maintain aspect ratio

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Supplier_Dashboard.pdf'); // Save the PDF
    });
  }
}
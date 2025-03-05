import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { Timesheet } from '../model/Timesheet ';
import { ProjectService } from '../service/project.service';
import { TimesheetService } from '../service/TimesheetService .service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; // Import html2canvas
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
})
export class TimesheetComponent implements OnInit {
  taskId: number = 1; // Example Task ID (matches idTask in Task model)
  projects: Project[] = []; // Array to hold projects
  selectedProjectId: number = 0; // Selected project ID (matches idProjet in Project model)
  timesheets: Timesheet[] = []; // Array to hold logged timesheets

  timesheet: Timesheet = {
    date: '',
    hoursWorked: 0,
    description: '',
    taskId: 0,
    projectId: 0,
  };

  constructor(
    private timesheetService: TimesheetService,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.loadTimesheets();
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (projects) => {
        this.projects = projects;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  loadTimesheets(): void {
    this.timesheetService.getTimesheets().subscribe((timesheets) => {
      this.timesheets = timesheets;
    });
  }

  logTimesheet(): void {
    this.timesheet.projectId = this.selectedProjectId; // Set the projectId in the timesheet
    this.timesheet.taskId = this.taskId; // Set the taskId in the timesheet
    this.timesheetService.logTimesheet(this.timesheet);

    // Reset the form
    this.timesheet = {
      date: '',
      hoursWorked: 0,
      description: '',
      taskId: 0,
      projectId: 0,
    };

    alert('Timesheet logged successfully!');
  }

  // Add this method to get the project name by projectId
  getProjectName(projectId: number): string {
    const project = this.projects.find((p) => p.idProjet === projectId);
    return project ? project.nomProjet : 'Unknown Project';
  }
  // Export timesheets to PDF
  exportToPDF(): void {
    // Force Angular to update the view
    this.cdr.detectChanges();
  
    // Get the table element
    const element = document.getElementById('timesheet-table');
    if (!element) {
      console.error('Table element not found');
      alert('Table element not found. Please ensure the table is rendered.');
      return;
    }
  
    // Proceed with generating the PDF
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      // Add a logo (replace 'assets/constructify-logo.png' with the path to your logo)
      const logo = new Image();
      logo.src = 'assets/image/logo.png'; // Path to your logo
      logo.onload = () => {
        // Add the logo to the PDF (position: x=10, y=10, size: width=30, height=auto)
        pdf.addImage(logo, 'PNG', 10, 10, 30, 30 * (logo.height / logo.width));
  
        // Add company name and address
        pdf.setFontSize(16);
        pdf.setTextColor(40, 40, 40); // Dark gray color
        pdf.setFont('helvetica', 'bold');
        pdf.text('Constructify', 50, 20);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('123 Construction Lane, Build City, BC 12345', 50, 26);
        pdf.text('Phone: +1 (123) 456-7890 | Email: info@constructify.com', 50, 32);
  
        // Add a title to the PDF
        pdf.setFontSize(20);
        pdf.setTextColor(0, 0, 0); // Black color
        pdf.setFont('helvetica', 'bold');
        pdf.text('Timesheet Report', 10, 50);
  
        // Add a subtitle
        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100); // Light gray color
        pdf.setFont('helvetica', 'normal');
        pdf.text('Employee Timesheet Details', 10, 56);
  
        // Add document details
        const downloadDate = new Date().toLocaleDateString();
        const downloadTime = new Date().toLocaleTimeString();
        pdf.setFontSize(10);
        pdf.text(`Document ID: TS-${Math.floor(Math.random() * 10000)}`, 10, 64);
        pdf.text(`Download Date: ${downloadDate} ${downloadTime}`, 10, 68);
  
        // Add a horizontal line separator
        pdf.setDrawColor(200, 200, 200); // Light gray color
        pdf.line(10, 72, 200, 72); // Draw a line from (x1, y1) to (x2, y2)
  
        // Add the table image to the PDF
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 10, 80, imgWidth, imgHeight);
  
        // Add a footer
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100); // Light gray color
        pdf.text('This document is confidential and intended for internal use only.', 10, 280);
        pdf.text('Unauthorized distribution is prohibited.', 10, 284);
  
        // Add a signature line
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0); // Black color
        pdf.text('Authorized by: ________________________', 10, 290);
  
        // Add a horizontal line separator in the footer
        pdf.setDrawColor(200, 200, 200); // Light gray color
        pdf.line(10, 294, 200, 294); // Draw a line from (x1, y1) to (x2, y2)
  
        // Add a page number
        pdf.setFontSize(10);
        pdf.text('Page 1 of 1', 180, 290);
  
        // Save the PDF
        pdf.save('Constructify_Timesheets.pdf');
      };
    });
  }
}


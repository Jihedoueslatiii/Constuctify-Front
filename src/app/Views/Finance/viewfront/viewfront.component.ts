import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../../service/finance.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-viewfront',
  templateUrl: './viewfront.component.html',
  styleUrls: ['./viewfront.component.css']
})
export class ViewfrontComponent implements OnInit {
  listFinance: { 
    financeId: number, 
    cost: number, 
    budget: number, 
    otherExpenses: number, 
    description: string, 
    roi: number 
  }[] = [];
  
  page: number = 1;

  constructor(private rs: FinanceService, private router: Router) {}

  ngOnInit(): void {
    this.loadFinances();
  }

  loadFinances(): void {
    this.rs.getFinance().subscribe({
      next: (res) => this.listFinance = res,
      error: (err) => console.error('Erreur de récupération des finances :', err)
    });
  }

  getRandomDate(): Date {
    const start = new Date(2023, 0, 1).getTime();
    const end = new Date(2025, 11, 31).getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime);
  }

  exportAsPDF(): void {
    const data: HTMLElement | null = document.getElementById('pdfContainer');
    if (data) {
        html2canvas(data, { scale: 2 }).then(canvas => {
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');

            const logoPath = 'assets/img/white-text.png';
            pdf.addImage(logoPath, 'PNG', 10, 10, 30, 30);

            pdf.setFontSize(22);
            pdf.setTextColor('#2A5D89');
            pdf.text('List project', 50, 25);

            pdf.addImage(imgData, 'PNG', 10, 50, imgWidth, imgHeight);

            pdf.setFontSize(10);
            pdf.setTextColor('#555555');
            pdf.text('Exporté le : ' + new Date().toLocaleString(), 10, pdf.internal.pageSize.height - 10);

            pdf.save('Liste_Budget.pdf');
        });
    }
  }


  validerProjet(financeId: number): void {
    this.rs.validerFinance(financeId).subscribe({
      next: () => this.loadFinances(),
      error: (err) => console.error('Erreur lors de la validation :', err)
    });
  }
}
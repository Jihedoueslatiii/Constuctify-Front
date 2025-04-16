import { Component, OnInit } from '@angular/core';
import { ProblemRisk, ProblemRiskService } from 'src/app/Views/service/problem-risk.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { NotificationService } from 'src/app/Views/service/notification.service';

@Component({
  selector: 'app-problem-risk-list',
  templateUrl: './problem-risk-list.component.html',
  styleUrls: ['./problem-risk-list.component.css']
})
export class ProblemRiskListComponent implements OnInit {
  listProblemRisk: ProblemRisk[] = [];
  filteredProblemRisks: ProblemRisk[] = [];
  searchTerm: string = '';

  showStats: boolean = false;
  statsByType: { name: string; value: number }[] = [];
  statsByStatus: { name: string; value: number }[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Filtres
  selectedType: string = '';
  selectedStatus: string = '';

  constructor(
    private problemRiskService: ProblemRiskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.problemRiskService.getAllProblemRisks().subscribe({
      next: (data) => {
        this.listProblemRisk = data;
        this.filterProblemRisks();
        this.checkDetectionDates(); // Vérifier les dates de détection
      },
      error: (err) => {
        console.error('Erreur lors du chargement des ProblemRisk :', err);
        this.notificationService.addNotification('Erreur lors du chargement des problèmes/risques.');
      }
    });
  }

  // Vérifier les dates de détection
  checkDetectionDates(): void {
    const now = new Date();
    this.listProblemRisk.forEach(pr => {
      if (pr.detectionDate) {
        const detectionDate = new Date(pr.detectionDate);
        const timeDiff = detectionDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff <= 3 && daysDiff >= 0) {
          this.notificationService.addNotification(`La date de détection pour "${pr.title}" est proche (${daysDiff} jours restants).`);
        } else if (daysDiff < 0) {
          this.notificationService.addNotification(`La date de détection pour "${pr.title}" est dépassée.`);
        }
      }
    });
  }

  deleteProblemRisk(id?: number): void {
    if (!id) return;
    if (confirm('Voulez-vous supprimer ce ProblemRisk ?')) {
      this.problemRiskService.deleteProblemRisk(id).subscribe({
        next: () => {
          this.listProblemRisk = this.listProblemRisk.filter(pr => pr.idProblemRisk !== id);
          this.filterProblemRisks();
          this.notificationService.addNotification('Problème/Risque supprimé avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          this.notificationService.addNotification('Erreur lors de la suppression du problème/risque.');
        }
      });
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term.trim().toLowerCase();
    this.filterProblemRisks();
  }

  filterProblemRisks(): void {
    let filtered = this.listProblemRisk.filter(pr =>
      (pr.title?.toLowerCase() || '').includes(this.searchTerm) ||
      (pr.type?.toLowerCase() || '').includes(this.searchTerm) ||
      (pr.problemStatus?.toLowerCase() || '').includes(this.searchTerm) ||
      (pr.description?.toLowerCase() || '').includes(this.searchTerm)
    );

    if (this.selectedType) {
      filtered = filtered.filter(pr => pr.type === this.selectedType);
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(pr => pr.problemStatus === this.selectedStatus);
    }

    this.filteredProblemRisks = filtered;
    this.currentPage = 1;
  }

  loadStatistics(): void {
    forkJoin({
      statsType: this.problemRiskService.getStatsByType().pipe(catchError(err => of({}))),
      statsStatus: this.problemRiskService.getStatsByStatus().pipe(catchError(err => of({})))
    }).subscribe(({ statsType, statsStatus }) => {
      this.statsByType = Object.entries(statsType || {}).map(([key, value]) => ({ name: key, value: value as number }));
      this.statsByStatus = Object.entries(statsStatus || {}).map(([key, value]) => ({ name: key, value: value as number }));
      this.showStats = this.statsByType.length > 0 || this.statsByStatus.length > 0;
    });
  }

  get paginatedProblemRisks(): ProblemRisk[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProblemRisks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.filteredProblemRisks.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  exportPdf(): void {
    if (!confirm("Voulez-vous exporter les problèmes/risques en PDF ?")) return;

    const doc = new jsPDF();
    const img = new Image();
    img.src = 'assets/image/logoo.png';
    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 10, 30, 30);
      doc.setFontSize(18);
      doc.setTextColor(42, 93, 137);
      doc.text("Report of Problèmes / Risques", 60, 20);
      doc.setDrawColor(42, 93, 137);
      doc.line(10, 35, 200, 35);

      const columns = ["Title", "Type", "Status", "Description", "Probabilité", "Solution Appliquée", "Detection", "Resolution"];
      const rows = this.filteredProblemRisks.map(pr => [
        pr.title || "",  // Valeur par défaut si undefined
        pr.type || "",   // Valeur par défaut si undefined
        pr.problemStatus || "",  // Valeur par défaut si undefined
        pr.description || "",  // Valeur par défaut si undefined
        pr.probability || "",  // Valeur par défaut si undefined
        pr.appliedSolutions || "",  // Valeur par défaut si undefined
        pr.detectionDate ? new Date(pr.detectionDate).toLocaleDateString() : "Non disponible",  // Formatté
        pr.resolutionDate ? new Date(pr.resolutionDate).toLocaleDateString() : "Non résolu"  // Formatté
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 40,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [42, 93, 137], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });

      const date = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Exporté le : ${date}`, 150, doc.internal.pageSize.height - 10);

      doc.save("problems_risks.pdf");
      this.notificationService.addNotification('Export PDF réussi.');
    };
  }

  exportExcel(): void {
    if (!confirm("Voulez-vous exporter les problèmes/risques en Excel ?")) return;

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredProblemRisks.map(pr => ({
      "Title": pr.title,
      "Type": pr.type,
      "Status": pr.problemStatus,
      "Description": pr.description,
      "Probabilité": pr.probability || "",  // Valeur par défaut si undefined
      "Solution Appliquée": pr.appliedSolutions || "",  // Valeur par défaut si undefined
      "Date of Detection": pr.detectionDate ? new Date(pr.detectionDate).toLocaleDateString() : "Non disponible",
      "Date of Resolution": pr.resolutionDate ? new Date(pr.resolutionDate).toLocaleDateString() : "Non résolu"
    })));

    const sheetName = "Problemes_Risques";
    const workbook: XLSX.WorkBook = { Sheets: { [sheetName]: worksheet }, SheetNames: [sheetName] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'problems_risks.xlsx');
    this.notificationService.addNotification('Export Excel réussi.'); // Notification de succès
  }
} 

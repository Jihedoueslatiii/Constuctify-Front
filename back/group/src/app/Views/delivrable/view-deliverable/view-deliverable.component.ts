import { Component, OnInit } from '@angular/core';
import { DeliverableService } from '../../service/deliverable.service';
import { Router } from '@angular/router';
import { DeliverableStatus } from '../../model/deliverable.module';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-deliverable',
  templateUrl: './view-deliverable.component.html',
  styleUrls: ['./view-deliverable.component.css']
})
export class ViewDeliverableComponent implements OnInit {
  DeliverableStatus = DeliverableStatus;
  listDeliverable: any[] = [];
  filteredDeliverables: any[] = [];
  searchTerm: string = '';
  dashboardStats: any = {};
  showDashboard = false;
  isKanbanView = false;
  currentDate: Date = new Date();
  isGeneratingPreview: boolean = false;
  isGeneratingPdf: boolean = false;

  // Colonnes Kanban
  todoDeliverables: any[] = [];
  inProgressDeliverables: any[] = [];
  completedDeliverables: any[] = [];
  validatedDeliverables: any[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;
  pageSizeOptions: number[] = [3, 6, 9, 12];

  completionStatusThresholds = [
    { threshold: 90, label: 'Excellent', class: 'excellent' },
    { threshold: 70, label: 'Très bien', class: 'very-good' },
    { threshold: 50, label: 'En bonne voie', class: 'on-track' },
    { threshold: 30, label: 'Attention nécessaire', class: 'needs-attention' },
    { threshold: 0, label: 'Critique', class: 'critical' }
  ];

  constructor(
    private rs: DeliverableService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDeliverables();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  loadDeliverables(): void {
    this.rs.getDeliverables().subscribe(
      res => {
        this.listDeliverable = res;
        this.filteredDeliverables = res;
        this.totalItems = this.filteredDeliverables.length;
        this.calculateDashboardStats();
        this.organizeKanbanColumns();
      },
      error => {
        console.error('Erreur de récupération des deliverables:', error);
      }
    );
  }

  organizeKanbanColumns(): void {
    this.todoDeliverables = this.listDeliverable.filter(d => !d.status || d.status === '');
    this.inProgressDeliverables = this.listDeliverable.filter(d => d.status === DeliverableStatus.IN_PROGRESS);
    this.completedDeliverables = this.listDeliverable.filter(d => d.status === DeliverableStatus.COMPLETED);
    this.validatedDeliverables = this.listDeliverable.filter(d => d.status === DeliverableStatus.VALIDATED);
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const movedItem = event.container.data[event.currentIndex];
      let newStatus: DeliverableStatus | string;
      
      switch (event.container.id) {
        case 'todoList': newStatus = ''; break;
        case 'inProgressList': newStatus = DeliverableStatus.IN_PROGRESS; break;
        case 'completedList': newStatus = DeliverableStatus.COMPLETED; break;
        case 'validatedList': newStatus = DeliverableStatus.VALIDATED; break;
        default: newStatus = movedItem.status;
      }
      
      this.updateDeliverable(movedItem.idDeliverable, { ...movedItem, status: newStatus });
    }
  }

  updateDeliverable(id: number, deliverable: any): void {
    this.rs.updateDeliverable(id, deliverable).subscribe({
      next: () => console.log('Statut mis à jour avec succès'),
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        this.loadDeliverables();
      }
    });
  }

  toggleView(): void {
    this.isKanbanView = !this.isKanbanView;
  }

  toggleDashboard(): void {
    this.showDashboard = !this.showDashboard;
    document.body.style.overflow = this.showDashboard ? 'hidden' : '';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
  }

  get paginatedDeliverables(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDeliverables.slice(startIndex, startIndex + this.itemsPerPage);
  }

  calculateDashboardStats(): void {
    const now = new Date();
    const completed = this.listDeliverable.filter(d => 
      d.status === DeliverableStatus.COMPLETED || 
      d.status === DeliverableStatus.VALIDATED
    ).length;

    const delayed = this.listDeliverable.filter(d => 
      d.status === DeliverableStatus.IN_PROGRESS &&
      new Date(d.expected_date) < now
    ).length;

    this.dashboardStats = {
      total: this.listDeliverable.length,
      completed,
      inProgress: this.listDeliverable.filter(d => d.status === DeliverableStatus.IN_PROGRESS).length,
      delayed,
      completionRate: this.listDeliverable.length > 0 ? Math.round((completed / this.listDeliverable.length) * 100) : 0
    };
  }

  getCompletionStatus(): { label: string, class: string } {
    if (!this.dashboardStats.completionRate) {
      return { label: 'Non disponible', class: 'na' };
    }
    const rate = this.dashboardStats.completionRate;
    return this.completionStatusThresholds.find(t => rate >= t.threshold) || 
           { label: 'Inconnu', class: 'unknown' };
  }

  deleteDeliverable(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer ce deliverable ?")) {
      this.rs.deleteDeliverable(id).subscribe({
        next: () => {
          this.listDeliverable = this.listDeliverable.filter(res => res.idDeliverable !== id);
          this.filterDeliverables();
          this.calculateDashboardStats();
          this.organizeKanbanColumns();
        },
        error: (err) => console.error('Erreur lors de la suppression du deliverable:', err)
      });
    }
  }

  filterDeliverables(): void {
    this.filteredDeliverables = this.listDeliverable.filter(deliverable =>
      deliverable.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (deliverable.delivery_date && deliverable.delivery_date.toString().includes(this.searchTerm)) ||
      (deliverable.expected_date && deliverable.expected_date.toString().includes(this.searchTerm))
    );
    this.totalItems = this.filteredDeliverables.length;
    this.currentPage = 1;
  }
  
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filterDeliverables();
  }

  async exportToPDF(): Promise<void> {
    this.isGeneratingPdf = true;
    const element = document.getElementById('pdfContent');
    
    if (!element) {
      console.error('Élément pdfContent non trouvé');
      this.isGeneratingPdf = false;
      return;
    }

    try {
      // Créer un clone de l'élément pour la capture
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.display = 'block';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.width = '800px';
      document.body.appendChild(clone);

      // Attendre que le DOM soit mis à jour
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      
      if (!imgData || imgData === 'data:,') {
        throw new Error('La capture du contenu a échoué');
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // En-tête
      pdf.setFontSize(18);
      pdf.setTextColor(42, 93, 137);
      pdf.text('Liste des Livrables', 105, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Généré le ${this.currentDate.toLocaleDateString()}`, 105, 22, { align: 'center' });

      // Contenu
      pdf.addImage({
        imageData: imgData,
        format: 'PNG',
        x: 10,
        y: 30,
        width: pdfWidth,
        height: pdfHeight
      });

      // Pied de page
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} sur ${pageCount}`,
          pdf.internal.pageSize.getWidth() / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      pdf.save(`livrables_${this.currentDate.toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF');
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  async openPreview(): Promise<void> {
    this.isGeneratingPreview = true;
    const element = document.getElementById('pdfContent');
    
    if (!element) {
      console.error('Élément pdfContent non trouvé');
      this.isGeneratingPreview = false;
      return;
    }

    try {
      // Afficher temporairement le contenu pour la capture
      const originalDisplay = element.style.display;
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, {
        scale: 1,
        logging: true,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      element.style.display = originalDisplay; // Restaurer l'état original

      const previewWindow = window.open('', '_blank');
      if (!previewWindow) {
        console.error('Impossible d\'ouvrir la fenêtre de prévisualisation');
        this.isGeneratingPreview = false;
        return;
      }

      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Prévisualisation des Livrables</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5; }
              .preview-container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 5px; }
              .preview-header { text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
              .preview-actions { display: flex; justify-content: center; gap: 15px; margin: 20px 0; }
              .preview-btn { padding: 10px 20px; background: #2A5D89; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
              .preview-btn:hover { background: #1E4A6B; }
              img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="preview-container">
              <div class="preview-header">
                <h1 style="color: #2A5D89;">Prévisualisation des Livrables</h1>
                <p>Généré le ${this.currentDate.toLocaleDateString()}</p>
              </div>
              <div class="preview-actions">
                <button class="preview-btn" onclick="window.print()">
                  Imprimer
                </button>
                <button class="preview-btn" onclick="window.close()">
                  Fermer
                </button>
              </div>
              <img src="${canvas.toDataURL('image/png')}" alt="Prévisualisation PDF">
            </div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    } catch (error) {
      console.error('Erreur lors de la génération de la prévisualisation:', error);
    } finally {
      this.isGeneratingPreview = false;
    }
  }
}
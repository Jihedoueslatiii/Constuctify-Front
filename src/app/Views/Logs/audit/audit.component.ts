import { Component, ChangeDetectorRef } from '@angular/core';
import { AuditService } from '../../service/audit/audit.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent {
  logs: any[] = [];
  totalLogs: number = 0;  // Nombre total de logs d'audit
  page: number = 0;  // Page actuelle
  size: number = 5;  // Taille de page initiale
  displayedColumns: string[] = ['id', 'username', 'action', 'timestamp'];

  constructor(private auditService: AuditService, private toastr: ToastrService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchAuditLogs();  // Initial fetch of logs
  }

  // Fonction pour récupérer les logs d'audit avec pagination
  fetchAuditLogs(): void {
    this.auditService.getAuditLogs(this.page, this.size).subscribe({
      next: (data) => {
        this.logs = data.content; // Les logs paginés sont dans 'content'
        this.totalLogs = data.totalElements; // Nombre total de logs
        this.cdr.detectChanges(); // Forcer le rafraîchissement de la vue
      },
      error: (err) => {
        this.toastr.error('Error fetching audit logs', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
      }
    });
  }

  // Fonction pour changer de page
  changePage(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize; // Mettre à jour la taille de la page
    this.fetchAuditLogs(); // Recharger les logs avec la nouvelle taille de page
  }
}
